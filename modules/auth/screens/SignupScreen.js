import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { registerUser } from "../services/authService";

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ⛔ Full Name Validation — Only Alphabets Allowed
  const validateFullName = (text) => {
    setFullName(text);

    const nameRegex = /^[A-Za-z ]+$/;

    if (text.length < 3) {
      setFullNameError("Full name must be at least 3 characters");
    } else if (!nameRegex.test(text)) {
      setFullNameError("Only alphabets and spaces are allowed");
    } else {
      setFullNameError("");
    }
  };

  // Email validation
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


  // Password validation
  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError(text.length >= 6 ? "" : "Password must be 6+ characters");
  };

  const isFormValid =
    fullName &&
    email &&
    password &&
    !fullNameError &&
    !emailError &&
    !passwordError;

  const handleSignup = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill all fields correctly before submitting.");
      return;
    }

    try {
      const res = await registerUser(fullName.trim(), email.trim(), password.trim());
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (err) {
      console.log("Signup failed:", err.response?.data);
      let message =
        err.response?.data?.message || "Signup failed. Please try again.";
      Alert.alert("Signup Failed", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={validateFullName}
        placeholder="Enter full name"
      />
      {fullNameError ? <Text style={styles.error}>{fullNameError}</Text> : null}

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={validateEmail}
        placeholder="Enter email"
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={validatePassword}
        placeholder="Enter password"
        secureTextEntry
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* Signup Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid ? "#007bff" : "#999" },
        ]}
        disabled={!isFormValid}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 25, textAlign: "center" },
  label: { fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginTop: -8,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  link: {
    color: "#000",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});

export default SignupScreen;

