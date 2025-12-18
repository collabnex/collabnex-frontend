import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Colors } from "../../global/theme/colors";

export default function AuthLayout({ children }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: Platform.OS === "web" ? 420 : "100%",
    },
});
