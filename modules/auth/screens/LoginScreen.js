import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { loginUser } from "../services/authService";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg(""); // clear previous error
    try {
      const res = await loginUser(email, password);
      console.log("Login success:", res.data);
      navigation.replace("Home"); // navigate to home
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setErrorMsg("Invalid email or password"); // show error on screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMsg(""); // clear error when typing
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMsg(""); // clear error when typing
        }}
      />

      {/* Red error message */}
      {errorMsg !== "" && <Text style={styles.error}>{errorMsg}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginVertical: 8 },
  button: { backgroundColor: "#000", padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  error: { color: "red", textAlign: "center", marginBottom: 10, fontSize: 14 },
});

export default LoginScreen;
