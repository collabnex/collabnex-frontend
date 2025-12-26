import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../global/services/env";

export default function CreateProfile() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  // ================= ROLE =================
  const [role, setRole] = useState(null); // USER | ARTIST

  // ================= FORM =================
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    profession: "",
    yearsOfExperience: "",
    country: "",
    state: "",
    city: "",
    latitude: "",
    longitude: "",
    linkedin: "",
    instagram: "",
    website: "",
  });

  const [errors, setErrors] = useState({});

  // ================= DOMAIN DROPDOWN =================
  const [openDomain, setOpenDomain] = useState(false);
  const [domain, setDomain] = useState(null);

  const domainList = [
    // Performing Arts
    { label: "Singer", value: "Singer" },
    { label: "Dancer", value: "Dancer" },
    { label: "Actor", value: "Actor" },
    { label: "Theatre Artist", value: "Theatre Artist" },
    { label: "Voice Artist", value: "Voice Artist" },

    // Music
    { label: "Musician", value: "Musician" },
    { label: "Guitarist", value: "Guitarist" },
    { label: "Pianist", value: "Pianist" },
    { label: "Drummer", value: "Drummer" },
    { label: "Music Producer", value: "Music Producer" },

    // Visual Arts
    { label: "Painter", value: "Painter" },
    { label: "Sketch Artist", value: "Sketch Artist" },
    { label: "Digital Artist", value: "Digital Artist" },
    { label: "Illustrator", value: "Illustrator" },
    { label: "Calligraphy Artist", value: "Calligraphy Artist" },

    // Media & Content
    { label: "Photographer", value: "Photographer" },
    { label: "Videographer", value: "Videographer" },
    { label: "Film Maker", value: "Film Maker" },
    { label: "Editor", value: "Editor" },
    { label: "Content Creator", value: "Content Creator" },

    // Design & Performance
    { label: "Choreographer", value: "Choreographer" },
    { label: "Fashion Designer", value: "Fashion Designer" },
    { label: "Makeup Artist", value: "Makeup Artist" },
    { label: "Set Designer", value: "Set Designer" },
    { label: "Art Director", value: "Art Director" },
  ];


  // ================= SKILLS =================
  const [openSkills, setOpenSkills] = useState(false);
  const [skills, setSkills] = useState([]);

  const skillsList = [
    { label: "Singing", value: "Singing" },
    { label: "Dancing", value: "Dancing" },
    { label: "Guitar", value: "Guitar" },
    { label: "Piano", value: "Piano" },
    { label: "Drums", value: "Drums" },
    { label: "Violin", value: "Violin" },
    { label: "Acting", value: "Acting" },
    { label: "Theatre", value: "Theatre" },
    { label: "Painting", value: "Painting" },
    { label: "Sketching", value: "Sketching" },
    { label: "Digital Art", value: "Digital Art" },
    { label: "Photography", value: "Photography" },
    { label: "Videography", value: "Videography" },
    { label: "Content Creation", value: "Content Creation" },
    { label: "Music Production", value: "Music Production" },
  ];


  // ================= TAGS =================
  const [openTags, setOpenTags] = useState(false);
  const [tags, setTags] = useState([]);

  const tagsList = [
    // Experience level
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Professional", value: "Professional" },

    // Work identity
    { label: "Freelancer", value: "Freelancer" },
    { label: "Full-Time Artist", value: "Full-Time Artist" },
    { label: "Hobbyist", value: "Hobbyist" },

    // Collaboration intent
    { label: "Collaborator", value: "Collaborator" },
    { label: "Open to Gigs", value: "Open to Gigs" },
    { label: "Mentor", value: "Mentor" },
    { label: "Learner", value: "Learner" },

    // Availability
    { label: "Available Now", value: "Available Now" },
    { label: "Part-Time", value: "Part-Time" },
    { label: "Project-Based", value: "Project-Based" },

    // Work style
    { label: "Remote-Friendly", value: "Remote-Friendly" },
    { label: "Studio-Based", value: "Studio-Based" },
    { label: "Flexible Schedule", value: "Flexible Schedule" },

    // Personality / approach
    { label: "Disciplined", value: "Disciplined" },
    { label: "Experimental", value: "Experimental" },
    { label: "Detail-Oriented", value: "Detail-Oriented" },
    { label: "Self-Motivated", value: "Self-Motivated" },
  ];


  // ================= VALIDATION =================
  const validate = () => {
    let e = {};

    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!domain) e.domain = "Domain is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    if (!form.profession.trim()) e.profession = "Profession is required";
    if (!form.yearsOfExperience.trim())
      e.yearsOfExperience = "Experience is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.city.trim()) e.city = "City is required";
    if (skills.length === 0) e.skills = "Select at least one skill";
    if (tags.length === 0) e.tags = "Select at least one tag";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ================= USER FLOW =================
  const continueAsUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/profile/me`,
        { domain: "user" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigation.replace("Home");
    } catch {
      Alert.alert("Error", "Unable to ensure user profile");
    }
  };

  // ================= ARTIST SUBMIT =================
  const submitArtist = async () => {
    if (!validate()) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    const payload = {
      fullName: form.fullName,
      domain: domain,
      bio: form.bio,
      profession: form.profession,
      yearsOfExperience: Number(form.yearsOfExperience),
      country: form.country,
      state: form.state,
      city: form.city,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      skills,
      tags,
      collaborationType: domain,

    };

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/profile/me`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigation.replace("Home");
    } catch {
      Alert.alert("Error", "Profile creation failed");
    }
  };

  // ================= ROLE SELECTION =================
  if (!role) {
    return (
      <View style={styles.roleContainer}>
        <Text style={styles.title}>Welcome to CollabNex</Text>

        <View style={styles.roleCard}>
          <Text style={styles.roleTitle}>👤 I am a User</Text>
          <Text style={styles.roleDesc}>
            • Buy products & services{"\n"}
            • Find artists near you{"\n"}
            • Attend & explore events
          </Text>
          <TouchableOpacity style={styles.roleBtn} onPress={continueAsUser}>
            <Text style={styles.roleBtnText}>Continue as User</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.roleCard}>
          <Text style={styles.roleTitle}>🎨 I am an Artist</Text>
          <Text style={styles.roleDesc}>
            • Create events{"\n"}
            • Sell products & services{"\n"}
            • Get discovered by users
          </Text>
          <TouchableOpacity
            style={styles.roleBtn}
            onPress={() => setRole("ARTIST")}
          >
            <Text style={styles.roleBtnText}>Create Artist Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ================= ARTIST FORM =================
  return (
    <ScrollView ref={scrollRef} style={styles.screen}>
      <Text style={styles.title}>Artist Profile</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        value={form.fullName}
        onChangeText={(v) => setForm({ ...form, fullName: v })}
      />
      {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

      <Text style={styles.label}>Domain *</Text>
      <DropDownPicker
        open={openDomain}
        value={domain}
        items={domainList}
        setOpen={setOpenDomain}
        setValue={setDomain}
        zIndex={3000}
        style={styles.dropdown}
      />
      {errors.domain && <Text style={styles.error}>{errors.domain}</Text>}

      <Text style={styles.label}>Bio *</Text>
      <TextInput
        style={styles.input}
        value={form.bio}
        onChangeText={(v) => setForm({ ...form, bio: v })}
      />
      {errors.bio && <Text style={styles.error}>{errors.bio}</Text>}

      <Text style={styles.label}>Profession *</Text>
      <TextInput
        style={styles.input}
        value={form.profession}
        onChangeText={(v) => setForm({ ...form, profession: v })}
      />
      {errors.profession && (
        <Text style={styles.error}>{errors.profession}</Text>
      )}

      <Text style={styles.label}>Years of Experience *</Text>
      <TextInput
        style={styles.input}
        value={form.yearsOfExperience}
        onChangeText={(v) =>
          setForm({
            ...form,
            yearsOfExperience: v.replace(/[^0-9]/g, ""),
          })
        }
        keyboardType="number-pad"
      />
      {errors.yearsOfExperience && (
        <Text style={styles.error}>{errors.yearsOfExperience}</Text>
      )}

      {["country", "state", "city", "latitude", "longitude", "linkedin", "instagram", "website"].map(
        (key) => (
          <View key={key}>
            <Text style={styles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              onChangeText={(v) => setForm({ ...form, [key]: v })}
              keyboardType={
                key === "latitude" || key === "longitude"
                  ? "numeric"
                  : "default"
              }
            />
            {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
          </View>
        )
      )}

      <Text style={styles.label}>Skills *</Text>
      <DropDownPicker
        open={openSkills}
        value={skills}
        items={skillsList}
        setOpen={setOpenSkills}
        setValue={setSkills}
        multiple
        zIndex={2000}
        style={styles.dropdown}
      />
      {errors.skills && <Text style={styles.error}>{errors.skills}</Text>}

      <Text style={styles.label}>Tags *</Text>
      <DropDownPicker
        open={openTags}
        value={tags}
        items={tagsList}
        setOpen={setOpenTags}
        setValue={setTags}
        multiple
        zIndex={1000}
        style={styles.dropdown}
      />
      {errors.tags && <Text style={styles.error}>{errors.tags}</Text>}

      <TouchableOpacity style={styles.button} onPress={submitArtist}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: { backgroundColor: "#F8F7FF", padding: 16 },
  roleContainer: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  roleCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  roleTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  roleDesc: { color: "#6B6B80", marginBottom: 12 },
  roleBtn: {
    backgroundColor: "#592FE4",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  roleBtnText: { color: "#fff", fontWeight: "700" },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E4F0",
    borderRadius: 12,
    padding: 14,
  },
  dropdown: { borderColor: "#E5E4F0", borderRadius: 12, marginBottom: 10 },
  error: { color: "#E53935", marginTop: 4 },
  button: {
    backgroundColor: "#592FE4",
    padding: 16,
    borderRadius: 18,
    marginTop: 24,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
