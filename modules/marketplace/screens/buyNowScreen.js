import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:8080";

const BuyNowScreen = ({ route, navigation }) => {
  const { serviceProductId, title } = route.params; // 🔥 dynamic ID

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});

  // ------------------- VALIDATION -------------------
  const validate = () => {
    const e = {};
    let ok = true;

    if (!name.trim()) {
      e.name = "Name is required";
      ok = false;
    } else if (name.trim().length < 3) {
      e.name = "Name must be at least 3 characters";
      ok = false;
    } else if (!/^[A-Za-z ]+$/.test(name.trim())) {
      e.name = "Only alphabets and spaces allowed";
      ok = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      e.phone = "Enter valid 10 digit phone";
      ok = false;
    }
    if (!message.trim()) {
      e.message = "Message required";
      ok = false;
    }

    setErrors(e);
    return ok;
  };

  // ------------------- SUBMIT -------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Login required", "Please login again.");
        return navigation.replace("Login");
      }

      const payload = {
        name,
        phone,
        message,
      };

      const url = `${BASE_URL}/api/service-enquiries/${serviceProductId}`;

      console.log("URL:", url);
      console.log("Payload:", payload);

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 token added correctly
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Your enquiry submitted!");

      setName("");
      setPhone("");
      setMessage("");

      navigation.goBack();
    } catch (error) {
      console.log("API ERROR:", error.response?.data, error.response?.status);

      if ([401, 403].includes(error.response?.status)) {
        Alert.alert("Unauthorized", "Please login again.");
        return navigation.replace("Login");
      }

      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Enquiry for {title}</Text>

      <Text style={styles.label}>Full Name</Text>

      <TextInput
        value={name}
        onChangeText={(text) => {
          // 1️⃣ Remove all non-alphabet characters except space
          let filtered = text.replace(/[^A-Za-z ]/g, "");

          // 2️⃣ Replace multiple spaces with single space
          filtered = filtered.replace(/\s+/g, " ");

          // 3️⃣ Trim leading spaces
          filtered = filtered.replace(/^\s/, "");

          // 4️⃣ Capitalize each word
          filtered = filtered
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          setName(filtered);

          // 5️⃣ Validation
          if (filtered.trim().length < 3) {
            setErrors((prev) => ({
              ...prev,
              name: "Name must be at least 3 letters",
            }));
          } else {
            setErrors((prev) => ({ ...prev, name: "" }));
          }
        }}
        style={[styles.input, errors.name && styles.errInput]}
        placeholder="Enter your name"
        autoCapitalize="words"
      />

      {errors.name && <Text style={styles.err}>{errors.name}</Text>}

      <Text style={styles.label}>Phone</Text>
      <TextInput
        value={phone}
        keyboardType="number-pad"
        maxLength={10}
        onChangeText={(val) => setPhone(val.replace(/[^0-9]/g, ""))}
        style={[styles.input, errors.phone && styles.errInput]}
        placeholder="10 digit phone"
      />
      {errors.phone && <Text style={styles.err}>{errors.phone}</Text>}

      <Text style={styles.label}>Message</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        style={[styles.textarea, errors.message && styles.errInput]}
        placeholder="Write your message"
      />
      {errors.message && <Text style={styles.err}>{errors.message}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "800", marginBottom: 25 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  textarea: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#FF9900",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
  err: { color: "red", fontSize: 12, marginBottom: 10 },
  errInput: { borderWidth: 1, borderColor: "red" },
});

export default BuyNowScreen;
