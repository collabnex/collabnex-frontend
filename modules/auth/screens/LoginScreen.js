import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CreateProfile from "./CreateProfile";
import { API_BASE_URL } from "../../global/services/env";



export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (text) => {
    const lower = text.toLowerCase();
    setEmail(lower);

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(lower)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError(text.length >= 6 ? "" : "Password must be 6+ characters");
  };

  const isButtonDisabled =
    !email ||
    !password ||
    !!emailError ||
    !!passwordError ||
    loading;

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginUser(email.trim(), password.trim());
      const token = res.data.data.token;

      await AsyncStorage.setItem("token", token);

      // check profile
      try {
        const profileRes = await axios.get(
          `${API_BASE_URL}/users/me/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profile = profileRes.data.data;
        if (profile?.bio?.trim()) {
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

  return (
    <AuthLayout>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <AuthInput
        label="Email"
        placeholder="Enter email"
        autoCapitalize="none"
        value={email}
        onChangeText={(t) => setEmail(t.toLowerCase())}
      />

      <AuthInput
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
