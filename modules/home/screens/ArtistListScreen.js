import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function ArtistListScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { city, domain } = route.params || {};

    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await axios.get(`${API_BASE_URL}/profile`, {
                params: { city, domain },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.warn("res", res);
            console.log("res", res.data);

            console.log("res", res.data.data[0].user.id);
            setArtists(res.data.data || []);
        } catch (err) {
            console.log("Error fetching artists", err);
        } finally {
            setLoading(false);
        }
    };

    const renderArtist = ({ item }) => {

        return (
            <View style={styles.card}>
                {/* Purple Banner */}
                <View style={styles.banner} />

                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                    {item.profileImageUrl ? (
                        <Image
                            source={{ uri: item.profileImageUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarText}>
                                {item.fullName?.charAt(0)?.toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Info */}
                <Text style={styles.name} numberOfLines={1}>
                    {item.fullName}
                </Text>

                <Text style={styles.meta}>
                    🎤 {item.domain}
                </Text>

                <Text style={styles.meta}>
                    📍 {item.city || "Unknown"}
                </Text>

                <Text style={styles.meta}>
                    ⏳ {item.yearsOfExperience ?? "0"} yrs exp
                </Text>

                {/* View Profile */}
                <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() =>
                        navigation.navigate("ArtistPublicProfile", {
                            artistId: item.user.id,   // ✅ correct
                        })


                    }
                >
                    <Text style={styles.viewBtnText}>View Profile</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 40 }} />;
    }

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>
                {city ? `Artists in ${city}` : `Artists (${domain})`}
            </Text>

            <FlatList
                data={artists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderArtist}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.empty}>No artists found</Text>
                }
            />
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F8F7FF",
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 16,
        color: "#1E1E2E",
    },

    card: {
        width: CARD_WIDTH,
        backgroundColor: "#FFF",
        borderRadius: 14,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 3,
    },

    banner: {
        height: 60,
        backgroundColor: "#6D28D9",
    },

    avatarWrapper: {
        alignSelf: "center",
        marginTop: -30,
        elevation: 6,
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: "#FFF",
    },

    avatarFallback: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#EDE9FE",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },

    avatarText: {
        fontSize: 24,
        fontWeight: "800",
        color: "#6D28D9",
    },

    name: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
    },

    meta: {
        fontSize: 13,
        color: "#6B6B80",
        textAlign: "center",
        marginTop: 2,
    },

    viewBtn: {
        marginTop: 10,
        marginHorizontal: 12,
        marginBottom: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#6D28D9",
        alignItems: "center",
    },

    viewBtnText: {
        color: "#FFF",
        fontSize: 13,
        fontWeight: "700",
    },

    empty: {
        textAlign: "center",
        marginTop: 40,
        color: "#6B6B80",
    },
});
