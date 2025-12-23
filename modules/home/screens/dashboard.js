import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

export default function DashboardScreen() {
    const navigation = useNavigation();

    const [premiumArtists, setPremiumArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH REAL PROFILES ================= */
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                const res = await axios.get(`${API_BASE_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profiles = res.data.data || [];
                console.warn("Dashboard fetched profiles:", profiles);
                // 🔀 Shuffle & pick max 12
                const shuffled = profiles.sort(() => 0.5 - Math.random());
                setPremiumArtists(shuffled.slice(0, 12));
            } catch (err) {
                console.log("Dashboard premium fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    /* ================= STATIC DATA ================= */
    const cities = [
        { name: "Bangalore", img: "https://images.unsplash.com/photo-1698332137428-3c4296198e8f" },
        { name: "Mumbai", img: "https://images.unsplash.com/photo-1595658658481-d53d3f999875" },
        { name: "Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
        { name: "Chennai", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220" },
        { name: "Hyderabad", img: "https://images.unsplash.com/photo-1657981630164-769503f3a9a8" },
        { name: "Kolkata", img: "https://images.unsplash.com/photo-1626198226928-617fc6c6203e" },
        { name: "Pune", img: "https://images.unsplash.com/photo-1577195943805-d9a2f1c404bd" },
        { name: "Ahmedabad", img: "https://plus.unsplash.com/premium_photo-1697730464803-fcede713753e" },
        { name: "Jaipur", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41" },
    ];

    const domains = [
        { name: "Singer", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d" },
        { name: "Dancer", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad" },
        { name: "Painter", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f" },
        { name: "Musician", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76" },
        { name: "Actor", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" },
        { name: "Photographer", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
        { name: "Designer", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
        { name: "Editor", img: "https://plus.unsplash.com/premium_photo-1663040316559-8684ca45d7e9" },
        { name: "Videographer", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
    ];

    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Discover Artists</Text>
            <Text style={styles.subtitle}>
                Find artists by city, domain & premium creators
            </Text>

            {/* ================= CITIES ================= */}
            <Text style={styles.sectionTitle}>Cities</Text>
            <View style={styles.grid}>
                {cities.map((c, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.gridCard}
                        onPress={() =>
                            navigation.navigate("ArtistList", {
                                city: c.name.toLowerCase(),
                            })
                        }
                    >
                        <Image source={{ uri: c.img }} style={styles.gridImage} />
                        <Text style={styles.gridText}>{c.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ================= DOMAINS ================= */}
            <Text style={styles.sectionTitle}>Domains</Text>
            <View style={styles.grid}>
                {domains.map((d, i) => (
                    <TouchableOpacity
                        key={i}
                        style={styles.gridCard}
                        onPress={() =>
                            navigation.navigate("ArtistList", {
                                domain: d.name.toLowerCase(),
                            })
                        }
                    >
                        <Image source={{ uri: d.img }} style={styles.gridImage} />
                        <Text style={styles.gridText}>{d.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {/* ================= FIND NEARBY CTA ================= */}
            <TouchableOpacity
                style={styles.nearbyBtn}
                onPress={() => navigation.navigate("NearbyArtists")}
            >
                <Text style={styles.nearbyIcon}>📍</Text>
                <Text style={styles.nearbyText}>Find Artists Near Me</Text>
            </TouchableOpacity>

            {/* ================= PREMIUM ARTISTS ================= */}
            <Text style={styles.sectionTitle}>Premium Artists 👑</Text>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#592FE4" />
            ) : (
                <FlatList
                    data={premiumArtists}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => (
                        <View style={styles.artistCard}>
                            <View style={styles.cardBanner} />

                            <View style={styles.avatarWrapper}>
                                {item.profileImageUrl ? (
                                    <Image
                                        source={{ uri: item.profileImageUrl }}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>
                                            {item.fullName?.charAt(0)?.toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                                <Text style={styles.crown}>👑</Text>
                            </View>

                            <Text style={styles.artistName}>{item.fullName}</Text>
                            <Text style={styles.artistMeta}>
                                {item.domain} • {item.city}
                            </Text>

                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={() =>
                                    navigation.navigate("ArtistPublicProfile", {
                                        artistId: item.user.id, // ✅ USER ID
                                    })
                                }
                            >
                                <Text style={styles.viewBtnText}>View Profile</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F8F7FF", padding: 16 },
    title: { fontSize: 28, fontWeight: "800", color: "#1E1E2E" },
    subtitle: { color: "#6B6B80", marginBottom: 20 },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginVertical: 12,
        color: "#1E1E2E",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    gridCard: {
        width: "31%",
        backgroundColor: "#FFF",
        borderRadius: 14,
        marginBottom: 12,
        overflow: "hidden",
        elevation: 3,
    },
    gridImage: { width: "100%", height: 80 },
    gridText: {
        textAlign: "center",
        padding: 6,
        fontWeight: "600",
        color: "#592FE4",
    },

    artistCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 3,
    },
    cardBanner: {
        height: 60,
        backgroundColor: "#592FE4",
    },
    avatarWrapper: {
        alignItems: "center",
        marginTop: -30,
    },
    avatar: {
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
    crown: {
        position: "absolute",
        top: -12,
        right: -8,
        fontSize: 18,
    },
    artistName: {
        textAlign: "center",
        fontWeight: "700",
        marginTop: 6,
    },
    artistMeta: {
        textAlign: "center",
        color: "#6B6B80",
        fontSize: 13,
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
    nearbyBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5C542", // gold
        paddingVertical: 14,
        borderRadius: 18,
        marginVertical: 20,
        elevation: 5,
    },

    nearbyIcon: {
        fontSize: 20,
        marginRight: 8,
    },

    nearbyText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#1E1E2E",
    }

});
