import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";

// ================= DUMMY API HANDLERS =================
const fetchArtistsByCity = (city) => {
    Alert.alert("API Call", `Fetch artists from ${city}`);
    // later:
    // axios.get(`/api/artists?city=${city}`)
};

const fetchArtistsByDomain = (domain) => {
    Alert.alert("API Call", `Fetch artists of domain ${domain}`);
    // later:
    // axios.get(`/api/artists?domain=${domain}`)
};

export default function DashboardScreen() {
    // ================= CITY DATA =================
    const cities = [
        {
            name: "Bangalore",
            image:
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
        },
        {
            name: "Mumbai",
            image:
                "https://images.unsplash.com/photo-1595658658481-d53d3f999875",
        },
        {
            name: "Delhi",
            image:
                "https://images.unsplash.com/photo-1587474260584-136574528ed5",
        },
        {
            name: "Chennai",
            image:
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        },
    ];

    // ================= DOMAIN DATA =================
    const domains = [
        {
            name: "Singer",
            image:
                "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
        },
        {
            name: "Dancer",
            image:
                "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        },
        {
            name: "Painter",
            image:
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
        },
        {
            name: "Musician",
            image:
                "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
        },
    ];

    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            {/* ================= HEADER ================= */}
            <Text style={styles.title}>Discover Artists</Text>
            <Text style={styles.subtitle}>
                Find artists by city or creative domain
            </Text>

            {/* ================= FIND BY CITY ================= */}
            <Text style={styles.sectionTitle}>Find Artists by City</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cities.map((city, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => fetchArtistsByCity(city.name)}
                    >
                        <Image source={{ uri: city.image }} style={styles.image} />
                        <Text style={styles.cardText}>{city.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ================= FIND BY DOMAIN ================= */}
            <Text style={styles.sectionTitle}>Find Artists by Domain</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {domains.map((domain, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => fetchArtistsByDomain(domain.name)}
                    >
                        <Image source={{ uri: domain.image }} style={styles.image} />
                        <Text style={styles.cardText}>{domain.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScrollView>
    );
}

// ================= STYLES =================
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F8F7FF",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E1E2E",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6B6B80",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        marginTop: 10,
        color: "#1E1E2E",
    },
    card: {
        width: 140,
        marginRight: 14,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        elevation: 3,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 100,
    },
    cardText: {
        textAlign: "center",
        padding: 10,
        fontWeight: "600",
        color: "#592FE4",
    },
});
