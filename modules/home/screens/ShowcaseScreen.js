import React from "react";
import { View, Text, StyleSheet } from "react-native";

/* 🎨 CollabNEX Theme */
const Colors = {
  primary: "#592FE4",
  secondary: "#8F7BFF",
  background: "#F8F7FF",
  white: "#FFFFFF",
  textPrimary: "#1E1E2E",
  textSecondary: "#6B6B80",
  border: "#E5E4F0",
};

export default function ShowcaseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcase</Text>

      <View style={styles.card}>
        <Text style={styles.emoji}>🎨</Text>
        <Text style={styles.heading}>Showcase launching soon</Text>
        <Text style={styles.subText}>
          Artists will soon be able to showcase their{"\n"}
          products, services and creative work here.
        </Text>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: Colors.white,
    width: "100%",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },

  subText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
