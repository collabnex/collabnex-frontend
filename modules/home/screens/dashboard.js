import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DashboardScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text>Welcome to CollabNex 🎉</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
});

export default DashboardScreen;
