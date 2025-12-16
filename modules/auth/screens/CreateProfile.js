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
import { API_BASE_URL } from "../../global/services/env";

import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function CreateProfile() {
  const navigation = useNavigation();

  const scrollRef = useRef();

  // refs for scrolling to first invalid field
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

  // Skills
  const [openSkills, setOpenSkills] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillsList, setSkillsList] = useState([
    { label: "Spring Boot", value: "Spring Boot" },
    { label: "Angular", value: "Angular" },
    { label: "MySQL", value: "MySQL" },
    { label: "Product Design", value: "Product Design" },
  ]);

  // Tags
  const [openTags, setOpenTags] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagsList, setTagsList] = useState([
    { label: "Team Player", value: "Team Player" },
    { label: "Creative", value: "Creative" },
    { label: "Fast Learner", value: "Fast Learner" },
    { label: "Problem Solver", value: "Problem Solver" },
  ]);

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!bio.trim()) newErrors.bio = "Bio is required";
    if (!profession.trim()) newErrors.profession = "Profession is required";
    if (!yearsOfExperience.trim())
      newErrors.yearsOfExperience = "Years of experience is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!stateName.trim()) newErrors.stateName = "State is required";
    if (!city.trim()) newErrors.city = "City is required";

    if (skills.length === 0) newErrors.skills = "Select at least one skill";
    if (tags.length === 0) newErrors.tags = "Select at least one tag";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT HANDLER
  const handleSubmit = async () => {
  // 1️⃣ Run validation and GET the latest errors immediately
  let newErrors = {};

  if (!fullName.trim()) newErrors.fullName = "Full Name is required";
  if (!bio.trim()) newErrors.bio = "Bio is required";
  if (!profession.trim()) newErrors.profession = "Profession is required";
  if (!yearsOfExperience.trim())
    newErrors.yearsOfExperience = "Years of experience is required";
  if (!country.trim()) newErrors.country = "Country is required";
  if (!stateName.trim()) newErrors.stateName = "State is required";
  if (!city.trim()) newErrors.city = "City is required";
  if (skills.length === 0) newErrors.skills = "Select at least one skill";
  if (tags.length === 0) newErrors.tags = "Select at least one tag";

  // update UI error state
  setErrors(newErrors);

  // 2️⃣ If errors exist → scroll to first error
  if (Object.keys(newErrors).length > 0) {
    const firstKey = Object.keys(newErrors)[0];

    if (inputsRef[firstKey]?.current) {
      inputsRef[firstKey].current.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current.scrollTo({ y: y - 40, animated: true });
        }
      );
    }

    return; // STOP submission
  }

  // 3️⃣ If no errors → proceed with submit
  const payload = {
    fullName,
    bio,
    profession,
    yearsOfExperience: Number(yearsOfExperience),
    skills: JSON.stringify(skills),
    tags: JSON.stringify(tags),
    country,
    state: stateName,
    city,
    socialLinks: JSON.stringify({
      linkedin,
      instagram,
      website,
    }),
    latitude: null,
    longitude: null,
    profileImageUrl: null,
    portfolioUrl: null,
    visibility: null,
    hourlyRate: null,
    availabilityStatus: null,
  };

  try {
    const token = await AsyncStorage.getItem("token");

    await axios.put(
  `${API_BASE_URL}/profile/me`,
  payload,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);




    Alert.alert("Success", "Profile updated successfully!");
    navigation.replace("Home");

  } catch (err) {
    console.log("Update Error:", err.response?.data || err);
    Alert.alert("Error", "Could not update profile. Check backend logs.");
  }
};


  return (
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>Fill out your details to get started 🌟</Text>

      <View style={styles.card}>
        {/* FULL NAME */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          ref={inputsRef.fullName}
          style={[styles.input, errors.fullName && { borderColor: "red" }]}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            setErrors((prev) => ({ ...prev, fullName: null }));
          }}
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}

        {/* BIO */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          ref={inputsRef.bio}
          style={[styles.input, { height: 90 }, errors.bio && { borderColor: "red" }]}
          placeholder="Tell us something about you"
          multiline
          value={bio}
          onChangeText={(text) => {
            setBio(text);
            setErrors((prev) => ({ ...prev, bio: null }));
          }}
        />
        {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}

        {/* PROFESSION */}
        <Text style={styles.label}>Profession</Text>
        <TextInput
          ref={inputsRef.profession}
          style={[styles.input, errors.profession && { borderColor: "red" }]}
          placeholder="Eg: Software Engineer"
          value={profession}
          onChangeText={(text) => {
            setProfession(text);
            setErrors((prev) => ({ ...prev, profession: null }));
          }}
        />
        {errors.profession && (
          <Text style={styles.errorText}>{errors.profession}</Text>
        )}

        {/* YEARS OF EXPERIENCE */}
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          ref={inputsRef.yearsOfExperience}
          style={[styles.input, errors.yearsOfExperience && { borderColor: "red" }]}
          placeholder="Eg: 2"
          keyboardType="numeric"
          value={yearsOfExperience}
          onChangeText={(text) => {
            setYearsOfExperience(text);
            setErrors((prev) => ({ ...prev, yearsOfExperience: null }));
          }}
        />
        {errors.yearsOfExperience && (
          <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>
        )}

        {/* SKILLS */}
        <Text style={styles.label}>Skills</Text>

        <DropDownPicker
          listMode="SCROLLVIEW"
          open={openSkills}
          value={skills}
          items={skillsList}
          setOpen={(callback) => {
            setOpenTags(false);      
            setOpenSkills(callback); 
          }}
          setValue={setSkills}
          setItems={setSkillsList}
          multiple
          min={1}
          placeholder="Select your skills"
          style={[styles.dropdown, errors.skills && { borderColor: "red" }]}
          dropDownContainerStyle={styles.dropdownContainer}
          showBadge
          showBadgeDot={false}
          multipleText={skills.join(", ")}
          onChangeValue={() =>
            setErrors((prev) => ({ ...prev, skills: null }))
          }
          onSelectItem={() => setOpenSkills(false)}
        />

        {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}

        <View style={styles.skillsWrapper}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* TAGS */}
        <Text style={styles.label}>Tags</Text>

        <DropDownPicker
          listMode="SCROLLVIEW"
          open={openTags}
          value={tags}
          items={tagsList}
          setOpen={(callback) => {
            setOpenSkills(false);     
            setOpenTags(callback);    
          }}
          setValue={setTags}
          setItems={setTagsList}
          multiple
          min={1}
          placeholder="Select personality tags"
          style={[styles.dropdown, errors.tags && { borderColor: "red" }]}
          dropDownContainerStyle={styles.dropdownContainer}
          showBadge
          showBadgeDot={false}
          multipleText={tags.join(", ")}
          onChangeValue={() =>
            setErrors((prev) => ({ ...prev, tags: null }))
          }
          onSelectItem={() => setOpenTags(false)}
        />

        {errors.tags && <Text style={styles.errorText}>{errors.tags}</Text>}

        <View style={styles.skillsWrapper}>
          {tags.map((tag, index) => (
            <View
              key={index}
              style={[styles.skillChip, { backgroundColor: "#FFD6E9" }]}
            >
              <Text style={[styles.skillText, { color: "#B42F6A" }]}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* COUNTRY */}
        <Text style={styles.label}>Country</Text>
        <TextInput
          ref={inputsRef.country}
          style={[styles.input, errors.country && { borderColor: "red" }]}
          placeholder="Eg: India"
          value={country}
          onChangeText={(text) => {
            setCountry(text);
            setErrors((prev) => ({ ...prev, country: null }));
          }}
        />
        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

        {/* STATE */}
        <Text style={styles.label}>State</Text>
        <TextInput
          ref={inputsRef.stateName}
          style={[styles.input, errors.stateName && { borderColor: "red" }]}
          placeholder="Eg: Telangana"
          value={stateName}
          onChangeText={(text) => {
            setStateName(text);
            setErrors((prev) => ({ ...prev, stateName: null }));
          }}
        />
        {errors.stateName && (
          <Text style={styles.errorText}>{errors.stateName}</Text>
        )}

        {/* CITY */}
        <Text style={styles.label}>City</Text>
        <TextInput
          ref={inputsRef.city}
          style={[styles.input, errors.city && { borderColor: "red" }]}
          placeholder="Eg: Hyderabad"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            setErrors((prev) => ({ ...prev, city: null }));
          }}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

        {/* SOCIAL LINKS */}
        <Text style={styles.label}>LinkedIn</Text>
        <TextInput
          style={styles.input}
          placeholder="Your LinkedIn URL"
          value={linkedin}
          onChangeText={setLinkedin}
        />

        <Text style={styles.label}>Instagram</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Instagram handle"
          value={instagram}
          onChangeText={setInstagram}
        />

        <Text style={styles.label}>Website / Portfolio</Text>
        <TextInput
          style={styles.input}
          placeholder="Your website URL"
          value={website}
          onChangeText={setWebsite}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F3FF",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4A237A",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B6B6B",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    color: "#4A237A",
  },

  input: {
    backgroundColor: "#F8F5FF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C7B5FF",
    padding: 14,
    fontSize: 15,
    color: "#3A3A3A",
  },

  dropdown: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C7B5FF",
    backgroundColor: "#F8F5FF",
    marginTop: 5,
    zIndex: 1000,
  },

  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C7B5FF",
    zIndex: 1000,
  },

  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },

  skillChip: {
    backgroundColor: "#EEDBFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  skillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5C2EA8",
  },

  button: {
    backgroundColor: "#7F32FF",
    padding: 16,
    borderRadius: 16,
    marginTop: 25,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
