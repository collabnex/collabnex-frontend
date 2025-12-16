import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";

import { registerUser } from "../services/authService";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { Colors } from "../../global/theme/colors";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateFullName = (text) => {
    setFullName(text);
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
      setBackendError(
        err.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
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

      {backendError ? (
        <Text style={styles.error}>{backendError}</Text>
      ) : null}

      <AuthButton
        title="Sign Up"
        loading={loading}
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
