import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* =========================
   ADD EVENTS SCREEN
========================= */

const AddEvents = ({ navigation }) => {
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    month: "",
    ticketPrice: "",
    totalSeats: ""
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* =========================
     VALIDATION
  ========================= */

  const toISODate = (value) => {
    const [day, month, year] = value.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  };

  const isValidDate = (value) => {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;
    const date = toISODate(value);
    return !isNaN(date.getTime());
  };

  

  const scrollToFirstInvalid = () => {
    if (!form.title.trim()) return fieldRefs.title.current?.focus();
    if (!isValidDate(form.startDate))
      return fieldRefs.startDate.current?.focus();
    if (!isValidDate(form.endDate))
      return fieldRefs.endDate.current?.focus();
  };

  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!form.startDate) return false;
    if (!form.endDate) return false;
    if (!form.month) return false;
    if (new Date(form.endDate) < new Date(form.startDate)) return false;
    return true;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Invalid Form", "Please fill all required fields correctly");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      locationText: form.location,
      startDatetime: new Date(form.startDate).toISOString(),
      endDatetime: new Date(form.endDate).toISOString(),
      eventMonth: form.month,
      ticketPrice: Number(form.ticketPrice || 0),
      totalSeats: Number(form.totalSeats || 0),
      availableSeats: Number(form.totalSeats || 0),
      currency: "INR",
      status: "PUBLISHED"
    };

    try {
      let token = await AsyncStorage.getItem("authToken");
      if (!token) token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "Please login again");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert("Success", "Event created", [
          { text: "OK", onPress: () => navigation.navigate("MyEvents") }
        ]);
      } else {
        Alert.alert("Error", "Failed to create event");
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const formValid = isFormValid();

  /* =========================
     UI
  ========================= */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔝 TOP BUTTONS */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyEvents")}
        >
          <Text style={styles.buttonText}>My Events</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonActive}>
          <Text style={styles.buttonTextActive}>Add Event</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Create Event</Text>

      {/* TITLE */}
      <View style={styles.card}>
        <Label text="Event Title *" />
        <TextInput
          ref={titleRef}
          style={styles.input}
          value={form.title}
          onChangeText={(v) => update("title", v)}
        />
      </View>

      {/* DATE PICKERS */}
      <View style={styles.card}>
        <Label text="Start Date *" />
        {Platform.OS === "web" ? (
          <input
            type="date"
            style={styles.webInput}
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.startDate}
            onChangeText={(v) => update("startDate", v)}
          />
        )}

        <Label text="End Date *" />
        {Platform.OS === "web" ? (
          <input
            type="date"
            style={styles.webInput}
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.endDate}
            onChangeText={(v) => update("endDate", v)}
          />
        )}
      </View>

      {/* MONTH PICKER */}
      <View style={styles.card}>
        <Label text="Event Month *" />
        {Platform.OS === "web" ? (
          <input
            type="month"
            style={styles.webInput}
            value={form.month}
            onChange={(e) => update("month", e.target.value)}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM"
            value={form.month}
            onChangeText={(v) => update("month", v)}
          />
        )}
      </View>

      {/* DETAILS */}
      <View style={styles.card}>
        <Label text="Description" />
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={form.description}
          onChangeText={(v) => update("description", v)}
        />

        <Label text="Location" />
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={(v) => update("location", v)}
        />
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={[styles.submitBtn, !formValid && styles.submitBtnDisabled]}
        disabled={!formValid}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F4F6FA"
  },

  /* TOP BAR */
  topBar: {
    flexDirection: "row",
    marginBottom: 16
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    marginRight: 8
  },
  buttonActive: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
    marginLeft: 8
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600"
  },
  buttonTextActive: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF"
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6
  },
  input: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12
  },
  webInput: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    marginBottom: 12,
    fontSize: 15
  },
  textArea: {
    height: 80
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center"
  },
  submitBtnDisabled: {
    backgroundColor: "#9CA3AF"
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  }
});

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default AddEvents;
