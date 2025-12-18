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

  // Convert DD-MM-YYYY → ISO
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

    if (end < start) return false;
    return true;
  };

  const scrollToFirstInvalid = () => {
    if (!form.title.trim()) {
      fieldRefs.title.current?.focus();
      return;
    }
    if (!isValidDate(form.startDate)) {
      fieldRefs.startDate.current?.focus();
      return;
    }
    if (!isValidDate(form.endDate)) {
      fieldRefs.endDate.current?.focus();
      return;
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
  if (!isFormValid()) {
    scrollToFirstInvalid();
    Alert.alert(
      "Incomplete Form",
      "Please fill all required fields correctly"
    );
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
    /* 🔐 GET TOKEN (ROBUST) */
    let token = await AsyncStorage.getItem("authToken");

    if (!token) token = await AsyncStorage.getItem("token");

    if (!token) {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user?.token || user?.accessToken;
      }
    }

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
      console.error("Create event error:", err);
      Alert.alert("Error", err || "Failed to create event");
    }
  } catch (error) {
    console.error("Create event exception:", error);
    Alert.alert("Error", "Something went wrong");
  }
};


  const formValid = isFormValid();

  /* =========================
     UI
  ========================= */

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          placeholder="DD-MM-YYYY (e.g. 20-12-2025)"
          value={form.startDate}
          onChangeText={(v) => update("startDate", v)}
        />

        <Label text="End Date *" />
        <Input
          ref={fieldRefs.endDate}
          placeholder="DD-MM-YYYY (e.g. 21-12-2025)"
          value={form.endDate}
          onChangeText={(v) => update("endDate", v)}
        />
      </View>

      {/* OPTIONAL DETAILS */}
      <View style={styles.card}>
        <Label text="Description" />
        <Input
          placeholder="e.g. An acoustic live music evening"
          multiline
          value={form.description}
          onChangeText={(v) => update("description", v)}
        />

        <Label text="Location" />
        <Input
          placeholder="e.g. Bangalore, India"
          value={form.location}
          onChangeText={(v) => update("location", v)}
        />
      </View>

      {/* TICKETS */}
      <View style={styles.card}>
        <Label text="Ticket Price (₹)" />
        <Input
          placeholder="e.g. 499"
          keyboardType="numeric"
          value={form.ticketPrice}
          onChangeText={(v) => update("ticketPrice", v)}
        />

        <Label text="Total Seats" />
        <Input
          placeholder="e.g. 100"
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
   REUSABLE COMPONENTS
========================= */

const Label = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

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
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151"
  },
  input: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    fontSize: 15
  },
  textArea: {
    height: 80,
    textAlignVertical: "top"
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8
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
