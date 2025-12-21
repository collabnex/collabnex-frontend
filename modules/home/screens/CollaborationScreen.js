import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../global/services/env";

const Collaboration = () => {
  const navigation = useNavigation(); // ✅ REQUIRED
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(
          `${API_BASE_URL}/profile/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile(response.data.data);
      } catch (err) {
        console.log("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6D28D9" />
      </View>
    );
  }

  if (!profile) return null;

  const skills = JSON.parse(profile.skills || "[]");
  const tags = JSON.parse(profile.tags || "[]");
  const social = JSON.parse(profile.socialLinks || "{}");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ================= HERO ================= */}
      <View style={styles.hero}>

        {/* ⚙️ SETTINGS BUTTON */}
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>

        <View style={styles.avatarWrapper}>
          {profile.profileImageUrl ? (
            <Image source={{ uri: profile.profileImageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {profile.fullName?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{profile.fullName}</Text>

        <View style={styles.domainBadge}>
          <Text style={styles.domainText}>
            🎤 {profile.domain?.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.location}>📍 {profile.city || "—"}</Text>
      </View>

      <Section title="🧠 About">
        <Text style={styles.text}>{profile.bio || "No bio provided"}</Text>
      </Section>

      <Section title="💼 Profession">
        <Text style={styles.text}>{profile.profession || "Not specified"}</Text>
      </Section>

      <Section title="⏳ Experience">
        <Text style={styles.text}>
          {profile.yearsOfExperience
            ? `${profile.yearsOfExperience} years`
            : "Not mentioned"}
        </Text>
      </Section>

      {skills.length > 0 && (
        <Section title="🛠 Skills">
          <View style={styles.badgeWrap}>
            {skills.map((s, i) => (
              <Badge key={i} text={s} />
            ))}
          </View>
        </Section>
      )}

      {tags.length > 0 && (
        <Section title="✨ Professional Traits">
          <View style={styles.badgeWrap}>
            {tags.map((t, i) => (
              <OutlineBadge key={i} text={t} />
            ))}
          </View>
        </Section>
      )}

      <Section title="🔗 Social Links">
        <InfoRow label="Website" value={social.website} />
        <InfoRow label="LinkedIn" value={social.linkedin} />
        <InfoRow label="Instagram" value={social.instagram} />
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default Collaboration;

/* ---------- SMALL COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Badge = ({ text }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{text}</Text>
  </View>
);

const OutlineBadge = ({ text }) => (
  <View style={styles.outlineBadge}>
    <Text style={styles.outlineBadgeText}>{text}</Text>
  </View>
);

const InfoRow = ({ label, value }) => (
  <Text style={styles.infoText}>
    {label}: <Text style={styles.infoValue}>{value || "N/A"}</Text>
  </Text>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FF" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  hero: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#6D28D9",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  settingsBtn: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  settingsIcon: { fontSize: 24, color: "#FFF" },

  avatarWrapper: { elevation: 6, marginBottom: 10 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: "#FFF" },
  avatarFallback: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#EDE9FE",
    justifyContent: "center", alignItems: "center",
    borderWidth: 4, borderColor: "#FFF",
  },
  avatarText: { fontSize: 42, fontWeight: "800", color: "#6D28D9" },

  name: { fontSize: 26, fontWeight: "800", color: "#FFF" },
  domainBadge: { marginTop: 6, backgroundColor: "#FFF", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  domainText: { color: "#6D28D9", fontWeight: "700" },
  location: { marginTop: 8, color: "#EDE9FE" },

  card: { backgroundColor: "#FFF", margin: 16, padding: 18, borderRadius: 16, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#6D28D9", marginBottom: 10 },
  text: { fontSize: 15, color: "#333" },

  badgeWrap: { flexDirection: "row", flexWrap: "wrap" },
  badge: { backgroundColor: "#EDE9FE", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  badgeText: { color: "#6D28D9", fontWeight: "600" },

  outlineBadge: { borderColor: "#A78BFA", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  outlineBadgeText: { color: "#6D28D9", fontWeight: "600" },

  infoText: { fontSize: 15, marginBottom: 6, color: "#444" },
  infoValue: { fontWeight: "700", color: "#111" },
});
