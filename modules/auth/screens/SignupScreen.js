import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { registerUser } from "../services/authService";
import { Colors } from "../../global/theme/colors";

// ✅ Custom components
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= VALIDATIONS =================

  const validateFullName = (text) => {
    const filtered = text.replace(/[^A-Za-z ]/g, "");
    setFullName(filtered);

    if (filtered.length < 3) {
      setFullNameError("Full name must be at least 3 characters");
    } else {
      setFullNameError("");
    }
  };

  const validateEmail = (text) => {
    const lower = text.toLowerCase();
    setEmail(lower);

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    setEmailError(emailRegex.test(lower) ? "" : "Invalid email format");
  };

  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError(
      text.length >= 6 ? "" : "Minimum 6 characters required"
    );
  };

  const isFormValid =
    fullName &&
    email &&
    password &&
    !fullNameError &&
    !emailError &&
    !passwordError &&
    !loading;

  // ================= SIGNUP =================

  const handleSignup = async () => {
    try {
      setLoading(true);
      setApiError("");

      await registerUser(
        fullName.trim(),
        email.trim(),
        password.trim()
      );

      navigation.replace("Login");
    } catch (err) {
      console.log("Signup failed:", err.response?.data);

      if (
        err.response?.status === 409 ||
        err.response?.data?.message === "Email already registered"
      ) {
        setApiError("Email already registered");
      } else {
        Alert.alert(
          "Signup Failed",
          err.response?.data?.message || "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <AuthLayout>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join CollabNEX today</Text>

      <AuthInput
        label="Full Name"
        placeholder="Enter full name"
        value={fullName}
        onChangeText={validateFullName}
        error={fullNameError}
      />

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
        placeholder="Create password"
        secureTextEntry
        value={password}
        onChangeText={validatePassword}
        error={passwordError}
      />

      {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? Colors.primary : "#999" },
        ]}
        disabled={!isFormValid}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => navigation.replace("Login")}
      >
        Already have an account? Log in
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
    marginTop: 6,
  },
  error: {
    color: Colors.error,
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 22,
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "600",
  },
});
