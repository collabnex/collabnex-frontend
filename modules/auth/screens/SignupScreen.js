import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

import { registerUser } from "../services/authService";
import { API_BASE_URL } from "../../global/services/env";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ✅ ADDED
  const [apiError, setApiError] = useState("");

  const validateFullName = (text) => {
    const filtered = text.replace(/[^A-Za-z ]/g, "");
    setFullName(filtered);

    const nameRegex = /^[A-Za-z ]+$/;

    if (text.length < 3) {
      setFullNameError("Full name must be at least 3 characters");
    } else if (!nameRegex.test(text)) {
      setFullNameError("Only alphabets and spaces allowed");
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
    setPasswordError(text.length >= 6 ? "" : "Minimum 6 characters required");
  };

  const isFormValid =
    fullName &&
    email &&
    password &&
    !fullNameError &&
    !emailError &&
    !passwordError &&
    !loading;

  const handleSignup = async () => {
    try {
      setLoading(true);
      setBackendError("");

      await registerUser(
        fullName.trim(),
        email.trim(),
        password.trim()
      );

      navigation.replace("Login");
    } catch (err) {
      console.log("Signup failed:", err.response?.data);

      // ✅ ADDED (ONLY LOGIC CHANGE)
      if (
        err.response?.data?.message === "Email already registered" ||
        err.response?.status === 409
      ) {
        setApiError("Email already registered");
      } else {
        Alert.alert(
          "Signup Failed",
          err.response?.data?.message || "Signup failed. Please try again."
        );
      }
    }
  };

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
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* ✅ ADDED — Email already registered */}
      {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

      {/* Signup Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? "#007bff" : "#999" },
        ]}
        disabled={!isFormValid}
        onPress={handleSignup}
      />

      <Text
        style={styles.link}
        onPress={() => navigation.replace("Login")}
      >
        Already have an account? Log in
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
    marginTop: 6,
  },
  error: {
    color: Colors.error,
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    marginTop: 22,
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "600",
  },

});
