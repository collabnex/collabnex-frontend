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

export default function CreateProfile() {
  const navigation = useNavigation();
  const scrollRef = useRef();

  // ================= ROLE =================
  const [role, setRole] = useState(null); // "ARTIST" | "USER"

  // ================= REFS =================
  const inputsRef = {
    fullName: useRef(),
    bio: useRef(),
    profession: useRef(),
    yearsOfExperience: useRef(),
    country: useRef(),
    stateName: useRef(),
    city: useRef(),
  };

  const [errors, setErrors] = useState({});

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

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    let newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name required";
    if (!bio.trim()) newErrors.bio = "Bio required";
    if (!profession.trim()) newErrors.profession = "Profession required";
    if (!yearsOfExperience.trim())
      newErrors.yearsOfExperience = "Experience required";
    if (!country.trim()) newErrors.country = "Country required";
    if (!stateName.trim()) newErrors.stateName = "State required";
    if (!city.trim()) newErrors.city = "City required";
    if (skills.length === 0) newErrors.skills = "Select skills";
    if (tags.length === 0) newErrors.tags = "Select tags";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      inputsRef[firstKey]?.current?.measureLayout(
        scrollRef.current,
        (x, y) => scrollRef.current.scrollTo({ y: y - 40, animated: true })
      );
      return;
    }

    const payload = {
      role: "ARTIST",
      fullName,
      bio,
      profession,
      yearsOfExperience: Number(yearsOfExperience),
      skills: JSON.stringify(skills),
      tags: JSON.stringify(tags),
      country,
      state: stateName,
      city,
      socialLinks: JSON.stringify({ linkedin, instagram, website }),
    };

    try {
      const token = await AsyncStorage.getItem("token");

      await axios.put("http://localhost:8080/api/profile/me", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Profile created successfully");
      navigation.replace("Home");
    } catch (err) {
      Alert.alert("Error", "Profile creation failed");
    }
  };

  // ================= ROLE SELECTION SCREEN =================
  if (!role) {
    return (
      <View style={styles.roleContainer}>
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>
          Choose one to continue
        </Text>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => setRole("ARTIST")}
        >
          <Text style={styles.roleTitle}>🎨 I am an Artist</Text>
          <Text style={styles.roleDesc}>
            Showcase your skills & get discovered
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.replace("Home")}
        >
          <Text style={styles.roleTitle}>👤 I am a User</Text>
          <Text style={styles.roleDesc}>
            Discover & collaborate with artists
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ================= ARTIST FORM =================
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Artist Profile</Text>
      <Text style={styles.subtitle}>
        Tell us about your creative journey
      </Text>

      <View style={styles.card}>
        <TextInput
          ref={inputsRef.fullName}
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          ref={inputsRef.bio}
          style={[styles.input, { height: 90 }]}
          placeholder="Short Bio"
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <TextInput
          ref={inputsRef.profession}
          style={styles.input}
          placeholder="Profession"
          value={profession}
          onChangeText={setProfession}
        />

        <TextInput
          ref={inputsRef.yearsOfExperience}
          style={styles.input}
          placeholder="Years of experience"
          keyboardType="numeric"
          value={yearsOfExperience}
          onChangeText={setYearsOfExperience}
        />

        {/* SKILLS */}
        <DropDownPicker
          open={openSkills}
          value={skills}
          items={skillsList}
          setOpen={(v) => {
            setOpenSkills(v);
            setOpenTags(false);
          }}
          setValue={setSkills}
          setItems={setSkillsList}
          multiple
          style={[styles.dropdown, { zIndex: 3000 }]}
          dropDownContainerStyle={{ zIndex: 3000 }}
        />

        {/* TAGS */}
        <DropDownPicker
          open={openTags}
          value={tags}
          items={tagsList}
          setOpen={(v) => {
            setOpenTags(v);
            setOpenSkills(false);
          }}
          setValue={setTags}
          setItems={setTagsList}
          multiple
          style={[styles.dropdown, { zIndex: 2000 }]}
          dropDownContainerStyle={{ zIndex: 2000 }}
        />

        <TextInput
          ref={inputsRef.country}
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />

        <TextInput
          ref={inputsRef.stateName}
          style={styles.input}
          placeholder="State"
          value={stateName}
          onChangeText={setStateName}
        />

        <TextInput
          ref={inputsRef.city}
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="LinkedIn"
          value={linkedin}
          onChangeText={setLinkedin}
        />

        <TextInput
          style={styles.input}
          placeholder="Instagram"
          value={instagram}
          onChangeText={setInstagram}
        />

        <TextInput
          style={styles.input}
          placeholder="Website / Portfolio"
          value={website}
          onChangeText={setWebsite}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F6F4FF",
    padding: 16,
  },

  roleContainer: {
    flex: 1,
    backgroundColor: "#F6F4FF",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#2D1B69",
  },

  subtitle: {
    textAlign: "center",
    color: "#6E6E85",
    marginBottom: 24,
  },

  roleCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
  },

  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#592FE4",
    marginBottom: 6,
  },

  roleDesc: {
    fontSize: 14,
    color: "#6B6B80",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    elevation: 3,
  },

  input: {
    backgroundColor: "#FAF9FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D4FF",
    padding: 14,
    marginBottom: 14,
  },

  dropdown: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D4FF",
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#592FE4",
    padding: 16,
    borderRadius: 18,
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
