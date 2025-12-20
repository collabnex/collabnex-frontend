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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { API_BASE_URL } from "../../global/services/env";

export default function CreateProfile() {
  const navigation = useNavigation();
  const scrollRef = useRef();

  // ================= STEP CONTROL =================
  const [selectedRole, setSelectedRole] = useState(null);

  // ================= FORM STATE =================
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");

  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  const [errors, setErrors] = useState({});

  // ================= ARTIST CATEGORY =================
  const [openArtistCategory, setOpenArtistCategory] = useState(false);
  const [artistCategory, setArtistCategory] = useState(null);
  const [artistCategoryList] = useState([
    { label: "Singer", value: "Singer" },
    { label: "Dancer", value: "Dancer" },
    { label: "Painter", value: "Painter" },
    { label: "Actor", value: "Actor" },
    { label: "Musician", value: "Musician" },
  ]);

  // ================= SKILLS =================
  const [openSkills, setOpenSkills] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillsList, setSkillsList] = useState([
    { label: "Spring Boot", value: "Spring Boot" },
    { label: "Angular", value: "Angular" },
    { label: "MySQL", value: "MySQL" },
    { label: "Product Design", value: "Product Design" },
  ]);

  // ================= TAGS =================
  const [openTags, setOpenTags] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([
    { label: "Creative", value: "Creative" },
    { label: "Team Player", value: "Team Player" },
    { label: "Fast Learner", value: "Fast Learner" },
    { label: "Problem Solver", value: "Problem Solver" },
  ]);

  // ================= USER FLOW =================
  const continueAsUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please login again");
        return;
      }

      await axios.put(
        `${API_BASE_URL}/profile/me/domain`,
        { domain: "user" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigation.replace("Home");
    } catch {
      Alert.alert("Error", "Unable to continue as user");
    }
  };

  // ================= ARTIST SUBMIT =================
  const handleArtistSubmit = async () => {
    let newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name required";
    if (!bio.trim()) newErrors.bio = "Bio required";
    if (!profession.trim()) newErrors.profession = "Profession required";
    if (!yearsOfExperience.trim()) newErrors.yearsOfExperience = "Experience required";
    if (!artistCategory) newErrors.artistCategory = "Select artist category";
    if (!country.trim()) newErrors.country = "Country required";
    if (!stateName.trim()) newErrors.stateName = "State required";
    if (!city.trim()) newErrors.city = "City required";
    if (skills.length === 0) newErrors.skills = "Select skills";
    if (tags.length === 0) newErrors.tags = "Select tags";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      fullName,
      bio,
      profession,
      yearsOfExperience: Number(yearsOfExperience),
      artistCategory,                 // ✅ FIXED
      skills,
      tags,
      country,
      state: stateName,
      city,
      socialLinks: {
        linkedin,
        instagram,
        website,
      },
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please login again");
        return;
      }

      await axios.put(`${API_BASE_URL}/profile/me`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.replace("Home");
    } catch {
      Alert.alert("Error", "Profile creation failed");
    }
  };

  // ================= ROLE SELECTION =================
  if (!selectedRole) {
    return (
      <View style={styles.roleContainer}>
        <Text style={styles.title}>Who are you?</Text>

        <TouchableOpacity style={styles.roleCard} onPress={continueAsUser}>
          <Text style={styles.roleTitle}>👤 I am a User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => setSelectedRole("ARTIST")}
        >
          <Text style={styles.roleTitle}>🎨 I am an Artist</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ================= ARTIST FORM =================
  return (
    <ScrollView ref={scrollRef} style={styles.screen}>
      <Text style={styles.title}>Create Artist Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.label}>Profession</Text>
        <TextInput style={styles.input} value={profession} onChangeText={setProfession} />

        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={yearsOfExperience}
          onChangeText={setYearsOfExperience}
        />

        <Text style={styles.label}>Artist Category</Text>
        <DropDownPicker
          open={openArtistCategory}
          value={artistCategory}
          items={artistCategoryList}
          setOpen={setOpenArtistCategory}
          setValue={setArtistCategory}
          zIndex={4000}
          style={styles.dropdown}
        />

        <Text style={styles.label}>Skills</Text>
        <DropDownPicker
          open={openSkills}
          value={skills}
          items={skillsList}
          setOpen={setOpenSkills}
          setValue={setSkills}
          setItems={setSkillsList}
          multiple
          zIndex={3000}
          style={styles.dropdown}
        />

        <Text style={styles.label}>Tags</Text>
        <DropDownPicker
          open={openTags}
          value={tags}
          items={tagsList}
          setOpen={setOpenTags}
          setValue={setTags}
          setItems={setTagsList}
          multiple
          zIndex={2000}
          style={styles.dropdown}
        />

        <Text style={styles.label}>Country</Text>
        <TextInput style={styles.input} value={country} onChangeText={setCountry} />

        <Text style={styles.label}>State</Text>
        <TextInput style={styles.input} value={stateName} onChangeText={setStateName} />

        <Text style={styles.label}>City</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} />

        <Text style={styles.label}>LinkedIn</Text>
        <TextInput style={styles.input} value={linkedin} onChangeText={setLinkedin} />

        <Text style={styles.label}>Instagram</Text>
        <TextInput style={styles.input} value={instagram} onChangeText={setInstagram} />

        <Text style={styles.label}>Website</Text>
        <TextInput style={styles.input} value={website} onChangeText={setWebsite} />

        <TouchableOpacity style={styles.button} onPress={handleArtistSubmit}>
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  screen: { backgroundColor: "#F6F4FF", padding: 16 },
  roleContainer: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 16 },
  roleCard: { backgroundColor: "#fff", padding: 20, borderRadius: 16, marginBottom: 12 },
  roleTitle: { fontSize: 18, fontWeight: "700" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 18 },
  label: { fontWeight: "600", marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: "#FAF9FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D4FF",
    padding: 14,
    marginBottom: 10,
  },
  dropdown: { borderColor: "#D9D4FF", borderRadius: 12, marginBottom: 12 },
  button: { backgroundColor: "#592FE4", padding: 16, borderRadius: 18, marginTop: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
