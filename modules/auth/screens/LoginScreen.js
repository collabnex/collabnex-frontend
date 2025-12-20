import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import { loginUser } from "../services/authService";
import { API_BASE_URL } from "../../global/services/env";
import { Colors } from "../../global/theme/colors";

// custom components
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= VALIDATION =================

  const validateEmail = (text) => {
    const lower = text.toLowerCase();
    setEmail(lower);

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    setEmailError(emailRegex.test(lower) ? "" : "Invalid email format");
  };

  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError(
      text.length >= 6 ? "" : "Password must be 6+ characters"
    );
  };

  const isDisabled =
    !email ||
    !password ||
    !!emailError ||
    !!passwordError ||
    loading;

  // ================= LOGIN =================

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginUser(
        email.trim(),
        password.trim()
      );

      // 🔑 FIX: read correct tokens
      const { accessToken, refreshToken } = res.data.data;

      // 🔐 store refresh token (long-lived)
      if (Platform.OS === "web") {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      }

      // 🟢 TEMP FIX (to not break existing logic)
      // You were earlier using AsyncStorage.getItem("token")
      // So we store accessToken under SAME key
      await AsyncStorage.setItem("token", accessToken);

      // ================= PROFILE CHECK (UNCHANGED) =================

      try {
        const profileRes = await axios.get(
          `${API_BASE_URL}/users/me/profile`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const profile = profileRes.data.data;

        if (profile?.domain?.trim() === "user") {
          console.warn("User domain is 'user': " + profile?.domain?.trim());
          navigation.replace("Home");
        } else {
          navigation.replace("CreateProfile");
        }

      } catch {
        navigation.replace("CreateProfile");
      }

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <AuthLayout>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <AuthInput
        label="Email"
        placeholder="Enter email"
        autoCapitalize="none"
        value={email}
        onChangeText={validateEmail}
        error={emailError}
      />

      <AuthInput
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={validatePassword}
        error={passwordError}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AuthButton
        title="Login"
        loading={loading}
        disabled={isDisabled}
        onPress={handleLogin}
      />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Signup")}
      >
        Create new account
      </Text>
    </AuthLayout>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  error: {
    color: Colors.error,
    textAlign: "center",
    marginTop: 8,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "600",
  },
});
