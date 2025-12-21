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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../global/services/env";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function NearbyArtistsScreen() {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState([]);
    const [visibleCount, setVisibleCount] = useState(0);

    /* ================= FETCH NEARBY ================= */
    useEffect(() => {
        const fetchNearby = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                // 1️⃣ get my profile
                const meRes = await axios.get(`${API_BASE_URL}/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { latitude, longitude } = meRes.data.data;

                // 2️⃣ get nearby artists
                const res = await axios.get(`${API_BASE_URL}/profile/nearby`, {
                    params: { lat: latitude, lng: longitude },
                    headers: { Authorization: `Bearer ${token}` },
                });

                setArtists(res.data.data || []);
            } catch (err) {
                console.log("Nearby fetch error", err);
            }
        };

        fetchNearby();
    }, []);

    /* ================= LOADING & REVEAL ================= */
    useEffect(() => {
        if (artists.length === 0) return;

        // ⏳ 5 sec loader
        const loadingTimer = setTimeout(() => {
            setLoading(false);

            // ⏱ reveal one by one
            let count = 0;
            const interval = setInterval(() => {
                count++;
                setVisibleCount(count);

                if (count >= artists.length) {
                    clearInterval(interval);
                }
            }, 2000);

        }, 5000);

        return () => clearTimeout(loadingTimer);
    }, [artists]);

    /* ================= LOADER ================= */
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#592FE4" />
                <Text style={styles.loaderText}>
                    Finding people near you…{"\n"}stay tight 💜
                </Text>
            </View>
        );
    }

    /* ================= RENDER CARD ================= */
    const renderArtist = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.banner} />

            <View style={styles.avatarWrapper}>
                {item.profileImageUrl ? (
                    <Image source={{ uri: item.profileImageUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarFallback}>
                        <Text style={styles.avatarText}>
                            {item.fullName?.charAt(0)?.toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={styles.name}>{item.fullName}</Text>

            <Text style={styles.meta}>
                🎤 {item.domain}
            </Text>

            <Text style={styles.meta}>
                📍 {item.city}
            </Text>

            <Text style={styles.meta}>
                🚶 {item.distanceKm} km away
            </Text>

            <TouchableOpacity
                style={styles.viewBtn}
                onPress={() =>
                    navigation.navigate("ArtistPublicProfile", {
                        artistId: item.userId || item.user?.id,
                    })
                }
            >
                <Text style={styles.viewBtnText}>View Profile</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Artists Near You</Text>

            <FlatList
                data={artists.slice(0, visibleCount)}
                renderItem={renderArtist}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F8F7FF",
        padding: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 16,
        color: "#1E1E2E",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F7FF",
    },

    loaderText: {
        marginTop: 16,
        textAlign: "center",
        color: "#592FE4",
        fontWeight: "600",
        fontSize: 16,
    },

    card: {
        width: CARD_WIDTH,
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 3,
    },

    banner: {
        height: 50,
        backgroundColor: "#592FE4",
    },

    avatarWrapper: {
        alignItems: "center",
        marginTop: -25,
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
        fontSize: 22,
        fontWeight: "800",
        color: "#592FE4",
    },

    name: {
        textAlign: "center",
        fontWeight: "700",
        marginTop: 6,
    },

    meta: {
        textAlign: "center",
        fontSize: 13,
        color: "#6B6B80",
        marginTop: 2,
    },

    viewBtn: {
        margin: 10,
        paddingVertical: 8,
        backgroundColor: "#592FE4",
        borderRadius: 10,
    },

    viewBtnText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: "700",
    },
});
