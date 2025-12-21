import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        // ⏳ show loader for 2 seconds
        setTimeout(async () => {
            await AsyncStorage.clear();

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.logoutText}>🚪 Logout</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F7FF",
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 30,
        color: "#1E1E2E",
    },

    logoutBtn: {
        backgroundColor: "#EF4444",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },

    logoutText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
