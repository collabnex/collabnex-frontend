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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backendError, setBackendError] = useState("");

  const [loading, setLoading] = useState(false);

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /\S+@\S+\.\S+/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email format");
  };

  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError(text.length >= 6 ? "" : "Password must be 6+ characters");
  };

  // const handleLogin = async () => {
  //   setBackendError("");

  //   if (!email || !password || emailError || passwordError) {
  //     setBackendError("Please fix all errors before submitting");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const res = await loginUser(email, password);

  //     // console.log("LOGIN SUCCESS:", res.data);
  //     window.alert("Login Successfully")

  //     navigation.replace("Home");
  //   } catch (err) {
  //     // console.log("LOGIN FAILED:", err.response?.data);
  //     window.alert("Oops, Login Failed")

  //     const message =
  //       err.response?.data?.message ||
  //       "Invalid email or password. Please try again.";

  //     setBackendError(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
  setBackendError("");

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword || emailError || passwordError) {
    setBackendError("Please fix all errors before submitting");
    Alert.alert("Login Failed", "Please fix all errors before submitting");
    return;
  }

  try {
    setLoading(true);
    const res = await loginUser(trimmedEmail, trimmedPassword);

    // Login success
    Alert.alert("Success", "Login Successfully");
    navigation.replace("Home");
  } catch (err) {
    console.log("LOGIN FAILED:", err.response);

    // Default message
    let message = "Something went wrong. Please try again.";

    if (err.response) {
      // Server responded
      const status = err.response.status;

      if (status === 404) {
        message = "User not found"; // Displayed in alert
      } else if (status === 401) {
        message = "Invalid email or password";
      } else if (err.response.data?.message) {
        message = err.response.data.message;
      }
    } else if (err.request) {
      // No response from server
      message = "Server not reachable. Check your connection.";
    } else {
      // Other errors
      message = err.message;
    }

    setBackendError(message);
    Alert.alert("Login Failed", message); // Show backend error in alert
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
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





//----------------------------------------------------------------------

// import React, { useState } from "react";
// import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { loginUser } from "../services/authService";

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleLogin = async () => {
//     setErrorMessage(""); // Reset error when retry

//     try {
//       const res = await loginUser(email, password);
//       console.log("Login success:", res.data);
//       navigation.replace("Home");
//     } catch (err) {
//       console.error("Login failed:", err.response?.data || err.message);

//       const message =
//         err.response?.data?.message || "Invalid email or password";

//       setErrorMessage(message); // Show error on screen
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>

//       {errorMessage ? (
//         <Text style={styles.errorText}>{errorMessage}</Text>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginVertical: 8 },
//   button: { backgroundColor: "#000", padding: 15, borderRadius: 10, marginTop: 10 },
//   buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },

//   errorText: {
//     color: "red",
//     marginTop: 10,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });

// export default LoginScreen;
