import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { loginUser } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CreateProfile from "./CreateProfile";
import { API_BASE_URL } from "../../global/services/env";



export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    setBackendError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword || emailError || passwordError) {
      const msg = "Please fix all errors before submitting";
      setBackendError(msg);
      Alert.alert("Login Failed", msg);
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(trimmedEmail, trimmedPassword);
      const token = res.data.data.token; 
      await AsyncStorage.setItem("token", token);
      Alert.alert("Success", "Login Successfully");
      // navigation.replace("Home");
      try {
        const profileRes = await axios.get(
  `${API_BASE_URL}/users/me/profile`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

        const profile = profileRes.data.data;

       //  IF BIO EXISTS → PROFILE ALREADY CREATED
        if (profile && profile.bio && profile.bio.trim() !== "") {
        navigation.replace("Home");  // Dashboard
        } 
       //  IF BIO DOES NOT EXIST → CREATE PROFILE
        else {
        navigation.replace("CreateProfile");
        }
      } 
      catch (profileErr) {
        console.log("PROFILE CHECK ERROR:", profileErr.response?.data);
        navigation.replace("CreateProfile"); // fallback for new users
      }



      
    } catch (err) {
      console.log("LOGIN FAILED:", err.response);

      let message = "Something went wrong. Please try again.";

      if (err.response) {
        const status = err.response.status;

        if (status === 404) message = "User not found";
        else if (status === 401) message = "Invalid email or password";
        else if (err.response.data?.message) message = err.response.data.message;
      } else if (err.request) {
        message = "Server not reachable. Check your connection.";
      } else {
        message = err.message;
      }

      setBackendError(message);
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={validateEmail}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={validatePassword}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {backendError ? (
        <Text style={[styles.error, { marginTop: 10 }]}>{backendError}</Text>
      ) : null}

      {/* LOGIN BUTTON WITH DISABLE FEATURE */}
      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isButtonDisabled}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupText}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  signupText: {
    marginTop: 15,
    textAlign: "center",
    color: "#007bff",
  },
});


