import React, { useState, useMemo } from "react";
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
import { API_BASE_URL } from "../../global/services/env";

/* 🎨 CollabNEX Theme */
const Colors = {
  primary: "#592FE4",
  secondary: "#8F7BFF",
  background: "#F8F7FF",
  white: "#FFFFFF",
  textPrimary: "#1E1E2E",
  textSecondary: "#6B6B80",
  border: "#E5E4F0",
  error: "#E53935",
};

export default function BuyNowScreen({ route, navigation }) {
  const { serviceProductId, title } = route.params;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  /* -------------------------------
     INPUT HANDLER (SANITIZED)
  -------------------------------- */
  const update = (key, value) => {
    let v = value;

    if (key === "name") {
      v = value
        .replace(/[^A-Za-z ]/g, "")
        .replace(/\s+/g, " ")
        .replace(/^\s/, "")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    if (key === "phone") {
      v = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setForm((p) => ({ ...p, [key]: v }));
  };

  /* -------------------------------
     VALIDATION (SILENT)
  -------------------------------- */
  const isValid = useMemo(() => {
    if (form.name.trim().length < 3) return false;
    if (form.phone.length !== 10) return false;
    if (!form.message.trim()) return false;
    return true;
  }, [form]);

  /* -------------------------------
     SUBMIT
  -------------------------------- */
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        return navigation.replace("Login");
      }

      const payload = {
        name: form.name.trim(),
        phone: form.phone,
        message: form.message.trim(),
      };

      await axios.post(
        `${API_BASE_URL}/service-enquiries/${serviceProductId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Your enquiry has been sent");
      navigation.goBack();
    } catch (e) {
      console.log("Enquiry Error:", e.response || e);
      Alert.alert("Error", "Unable to send enquiry");
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Enquiry</Text>
      <Text style={styles.subtitle}>{title}</Text>

      <View style={styles.card}>
        <Field label="Full Name" required>
          <Input
            value={form.name}
            onChange={(v) => update("name", v)}
            placeholder="Enter your full name"
          />
        </Field>

        <Field label="Phone Number" required>
          <Input
            value={form.phone}
            keyboardType="numeric"
            onChange={(v) => update("phone", v)}
            placeholder="10 digit phone number"
          />
        </Field>

        <Field label="Message" required>
          <TextInput
            value={form.message}
            onChangeText={(v) => update("message", v)}
            style={[styles.input, styles.textarea]}
            placeholder="Write your message"
            multiline
          />
        </Field>

        <TouchableOpacity
          disabled={!isValid}
          style={[
            styles.button,
            !isValid && { opacity: 0.5 },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit Enquiry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* -------------------------------
   REUSABLE COMPONENTS
-------------------------------- */
const Field = ({ label, required, children }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>
      {label} {required && <Text style={{ color: Colors.error }}>*</Text>}
    </Text>
    {children}
  </View>
);

const Input = ({ value, onChange, placeholder, keyboardType }) => (
  <TextInput
    value={value}
    onChangeText={onChange}
    placeholder={placeholder}
    keyboardType={keyboardType}
    placeholderTextColor={Colors.textSecondary}
    style={styles.input}
  />
);

/* -------------------------------
   STYLES
-------------------------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.textPrimary,
  },

  subtitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  textarea: {
    height: 100,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },

  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
