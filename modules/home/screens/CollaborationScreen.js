import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Collaboration = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8080/api/users/me/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data.data);
      } catch (err) {
        console.log("API Error:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  const skills = JSON.parse(profile.skills || "[]");
  const tags = JSON.parse(profile.tags || "[]");
  const social = JSON.parse(profile.socialLinks || "{}");

  return (
    <ScrollView style={styles.container}>
      
      {/* ------------------ HEADER ------------------ */}
      <View style={styles.headerBanner} />

      {/* ------------------ PROFILE CARD ------------------ */}
      <View style={styles.profileContainer}>
        
        {/* Profile Image */}
        <View style={styles.profileImageWrapper}>
          {profile.profileImageUrl ? (
            <Image
              source={{ uri: profile.profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {profile.fullName?.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={styles.name}>{profile.fullName}</Text>

        {/* Profession */}
        <Text style={styles.profession}>{profile.profession}</Text>

        {/* Location */}
        <Text style={styles.location}>
          {profile.city}, {profile.state}, {profile.country}
        </Text>

      </View>

      {/* ------------------ ABOUT SECTION ------------------ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardText}>{profile.bio}</Text>
      </View>

      {/* ------------------ EXPERIENCE ------------------ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Experience</Text>
        <Text style={styles.cardText}>
          {profile.yearsOfExperience} years
        </Text>
      </View>

      {/* ------------------ SKILLS ------------------ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Skills</Text>
        <View style={styles.badgeContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ------------------ TAGS ------------------ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Professional Traits</Text>
        <View style={styles.badgeContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ------------------ SOCIAL LINKS ------------------ */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Social Links</Text>

        <Text style={styles.linkText}>
          Website: <Text style={styles.bold}>{social.website || "N/A"}</Text>
        </Text>
        <Text style={styles.linkText}>
          LinkedIn: <Text style={styles.bold}>{social.linkedin || "N/A"}</Text>
        </Text>
        <Text style={styles.linkText}>
          Instagram: <Text style={styles.bold}>{social.instagram || "N/A"}</Text>
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default Collaboration;

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5FF",
  },

  headerBanner: {
    height: 150,
    backgroundColor: "#6B21A8",
    width: "100%",
  },

  profileContainer: {
    marginTop: -70,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  profileImageWrapper: {
    elevation: 6,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFF",
  },

  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFF",
  },

  placeholderText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#6B21A8",
  },

  name: {
    marginTop: 15,
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
  },

  profession: {
    marginTop: 4,
    fontSize: 16,
    color: "#6B21A8",
    fontWeight: "600",
  },

  location: {
    marginTop: 6,
    color: "#555",
    fontSize: 14,
  },

  /* Card Styling */
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B21A8",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },

  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },

  skillBadge: {
    backgroundColor: "#E9D5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  skillText: {
    color: "#5B21B6",
    fontWeight: "600",
  },

  tagBadge: {
    borderColor: "#A855F7",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    color: "#7E22CE",
    fontWeight: "600",
  },

  linkText: {
    marginTop: 6,
    fontSize: 15,
    color: "#444",
  },

  bold: {
    fontWeight: "bold",
    color: "#111",
  },
});

