import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../../global/theme/colors";

export default function AuthButton({ title, loading, disabled, onPress }) {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            disabled={disabled || loading}
            onPress={onPress}
            style={[
                styles.button,
                (disabled || loading) && styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={Colors.white} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "600",
    },
});
