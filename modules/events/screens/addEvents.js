import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* =========================
   ADD EVENTS SCREEN
========================= */

const AddEvents = ({ navigation }) => {
  const fieldRefs = {
    title: useRef(null),
    startDate: useRef(null),
    endDate: useRef(null)
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "OFFLINE",
    location: "",
    startDate: "",
    endDate: "",
    ticketPrice: "",
    totalSeats: ""
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* =========================
     DATE HELPERS
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

  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!isValidDate(form.startDate)) return false;
    if (!isValidDate(form.endDate)) return false;

    const start = toISODate(form.startDate);
    const end = toISODate(form.endDate);

    return end >= start;
  };

  const scrollToFirstInvalid = () => {
    if (!form.title.trim()) return fieldRefs.title.current?.focus();
    if (!isValidDate(form.startDate))
      return fieldRefs.startDate.current?.focus();
    if (!isValidDate(form.endDate))
      return fieldRefs.endDate.current?.focus();
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
    if (!isFormValid()) {
      scrollToFirstInvalid();
      Alert.alert("Incomplete Form", "Please fill all required fields correctly");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      eventType: form.eventType,
      locationText: form.location,
      startDatetime: toISODate(form.startDate).toISOString(),
      endDatetime: toISODate(form.endDate).toISOString(),
      ticketPrice: Number(form.ticketPrice || 0),
      currency: "INR",
      totalSeats: Number(form.totalSeats || 0),
      availableSeats: Number(form.totalSeats || 0),
      status: "PUBLISHED"
    };

    try {
      let token = await AsyncStorage.getItem("authToken");
      if (!token) token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "Please login again");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert("Success", "Event created successfully", [
          {
            text: "OK",
            onPress: () => navigation.navigate("MyEvents")
          }
        ]);
      } else {
        const err = await response.text();
        Alert.alert("Error", err || "Failed to create event");
      }
    } catch {
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

      {/* BASIC DETAILS */}
      <View style={styles.card}>
        <Label text="Event Title *" />
        <Input
          ref={fieldRefs.title}
          placeholder="e.g. Live Music Night"
          value={form.title}
          onChangeText={(v) => update("title", v)}
        />
      </View>

      {/* DATE */}
      <View style={styles.card}>
        <Label text="Start Date *" />
        <Input
          ref={fieldRefs.startDate}
          placeholder="DD-MM-YYYY"
          value={form.startDate}
          onChangeText={(v) => update("startDate", v)}
        />

        <Label text="End Date *" />
        <Input
          ref={fieldRefs.endDate}
          placeholder="DD-MM-YYYY"
          value={form.endDate}
          onChangeText={(v) => update("endDate", v)}
        />
      </View>

      {/* OPTIONAL */}
      <View style={styles.card}>
        <Label text="Description" />
        <Input
          multiline
          value={form.description}
          onChangeText={(v) => update("description", v)}
        />

        <Label text="Location" />
        <Input
          value={form.location}
          onChangeText={(v) => update("location", v)}
        />
      </View>

      {/* TICKETS */}
      <View style={styles.card}>
        <Label text="Ticket Price (₹)" />
        <Input
          keyboardType="numeric"
          value={form.ticketPrice}
          onChangeText={(v) => update("ticketPrice", v)}
        />

        <Label text="Total Seats" />
        <Input
          keyboardType="numeric"
          value={form.totalSeats}
          onChangeText={(v) => update("totalSeats", v)}
        />
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          !formValid && styles.submitBtnDisabled
        ]}
        disabled={!formValid}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>
          {formValid ? "Create Event" : "Complete Required Fields"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* =========================
   REUSABLE
========================= */

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

const Input = React.forwardRef((props, ref) => (
  <TextInput
    ref={ref}
    style={[styles.input, props.multiline && styles.textArea]}
    {...props}
  />
));

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

export default AddEvents;
