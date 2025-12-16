import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../global/theme/colors";

export default function AuthInput({ label, error, ...props }) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                {...props}
                placeholderTextColor={Colors.textSecondary}
                style={[styles.input, error && styles.errorBorder]}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 14 },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    errorBorder: {
        borderColor: Colors.error,
    },
    error: {
        marginTop: 4,
        color: Colors.error,
        fontSize: 13,
    },
});
