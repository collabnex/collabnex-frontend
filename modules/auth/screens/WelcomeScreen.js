import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Brand */}
      <Text style={styles.brand}>CollabNEX</Text>

      {/* Main content */}
      <Text style={styles.title}>
        Where Artists{"\n"}Meet Opportunities
      </Text>

      <Text style={styles.subtitle}>
        Discover creative talent, collaborate on ideas,
        and connect directly with artists.
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.secondaryText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        For artists • creators • collaborators
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#592FE4",
    letterSpacing: 1,
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E1E2E",
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B6B80",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: Platform.OS === "web" ? 420 : "100%",
    marginBottom: 40,
  },

  actions: {
    width: "100%",
    maxWidth: 360,
  },

  primaryButton: {
    backgroundColor: "#592FE4",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#592FE4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6, // Android
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#592FE4",
  },

  secondaryText: {
    color: "#592FE4",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    marginTop: 30,
    fontSize: 13,
    color: "#6B6B80",
  },
});

export default WelcomeScreen;
