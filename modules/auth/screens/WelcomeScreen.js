import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CollabNex</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outline]}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonOutlineText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 40 },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
    marginVertical: 10,
  },
  outline: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#000" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonOutlineText: { color: "#000", fontSize: 16, fontWeight: "600" },
});

export default WelcomeScreen;
