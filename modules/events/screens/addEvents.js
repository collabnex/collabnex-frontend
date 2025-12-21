import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* =========================
   ADD EVENTS SCREEN
========================= */

const AddEvents = ({ navigation }) => {
  const titleRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "OFFLINE",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    onlineLink: "",
    ticketPrice: "",
    totalSeats: ""
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* =========================
     HELPERS
  ========================= */
  const toISO = (date, time) => {
    if (!date || !time) return null;
    const d = new Date(`${date}T${time}:00`);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  /* =========================
     VALIDATION
  ========================= */
  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!form.startDate || !form.startTime) return false;
    if (!form.endDate || !form.endTime) return false;

    const start = new Date(`${form.startDate}T${form.startTime}`);
    const end = new Date(`${form.endDate}T${form.endTime}`);
    if (end <= start) return false;

    if (form.eventType === "OFFLINE" && !form.location.trim()) return false;
    if (form.eventType === "ONLINE" && !form.onlineLink.trim()) return false;

    if (!form.totalSeats || Number(form.totalSeats) <= 0) return false;

    return true;
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const payload = {
      title: form.title,
      description: form.description,
      eventType: form.eventType,
      startDatetime: toISO(form.startDate, form.startTime),
      endDatetime: toISO(form.endDate, form.endTime),
      locationText: form.eventType === "OFFLINE" ? form.location : null,
      onlineLink: form.eventType === "ONLINE" ? form.onlineLink : null,
      ticketPrice: Number(form.ticketPrice || 0),
      currency: "INR",
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.totalSeats),
      status: "PUBLISHED"
    };

    try {
      const token =
        (await AsyncStorage.getItem("authToken")) ||
        (await AsyncStorage.getItem("token"));

      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowSuccessModal(true);
      }
    } catch {}
  };

  const formValid = isFormValid();

  /* =========================
     UI
  ========================= */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Event</Text>

      <View style={styles.card}>
        <Label text="Event Title *" />
        <TextInput
          ref={titleRef}
          style={styles.input}
          value={form.title}
          onChangeText={(v) => update("title", v)}
        />
      </View>

      <View style={styles.card}>
        <Label text="Event Type *" />
        <View style={styles.row}>
          {["OFFLINE", "ONLINE"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeBtn,
                form.eventType === type && styles.typeBtnActive
              ]}
              onPress={() => update("eventType", type)}
            >
              <Text
                style={
                  form.eventType === type
                    ? styles.typeTextActive
                    : styles.typeText
                }
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Label text="Start Date *" />
        <TextInput
          style={styles.input}
          value={form.startDate}
          onChangeText={(v) => update("startDate", v)}
        />
        <Label text="Start Time *" />
        <TextInput
          style={styles.input}
          value={form.startTime}
          onChangeText={(v) => update("startTime", v)}
        />
        <Label text="End Date *" />
        <TextInput
          style={styles.input}
          value={form.endDate}
          onChangeText={(v) => update("endDate", v)}
        />
        <Label text="End Time *" />
        <TextInput
          style={styles.input}
          value={form.endTime}
          onChangeText={(v) => update("endTime", v)}
        />
      </View>

      <View style={styles.card}>
        <Label text="Description" />
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={form.description}
          onChangeText={(v) => update("description", v)}
        />

        {form.eventType === "OFFLINE" && (
          <>
            <Label text="Location *" />
            <TextInput
              style={styles.input}
              value={form.location}
              onChangeText={(v) => update("location", v)}
            />
          </>
        )}

        {form.eventType === "ONLINE" && (
          <>
            <Label text="Online Link *" />
            <TextInput
              style={styles.input}
              value={form.onlineLink}
              onChangeText={(v) => update("onlineLink", v)}
            />
          </>
        )}
      </View>

      <View style={styles.card}>
        <Label text="Ticket Price" />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.ticketPrice}
          onChangeText={(v) => update("ticketPrice", v)}
        />
        <Label text="Total Seats *" />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.totalSeats}
          onChangeText={(v) => update("totalSeats", v)}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitBtn,
          !formValid && styles.submitBtnDisabled
        ]}
        disabled={!formValid}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Create Event</Text>
      </TouchableOpacity>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.modalTitle}>Event Created</Text>
            <Text style={styles.modalSubtitle}>
              Your event has been published successfully.
            </Text>

            <TouchableOpacity
              style={styles.modalConfirm}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MyEvents" }]
                });
              }}
            >
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>

            <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate("EventsScreen")}
  ></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F4F6FA" },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#F9FAFB", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 12 },
  textArea: { height: 80 },
  row: { flexDirection: "row", gap: 10 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "#E5E7EB", alignItems: "center" },
  typeBtnActive: { backgroundColor: "#007AFF" },
  typeText: { fontWeight: "600" },
  typeTextActive: { fontWeight: "700", color: "#FFFFFF" },
  submitBtn: { backgroundColor: "#007AFF", padding: 16, borderRadius: 14, alignItems: "center" },
  submitBtnDisabled: { backgroundColor: "#9CA3AF" },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 24,
    width: "85%",
    alignItems: "center"
  },
  successIcon: { fontSize: 42, marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20
  },
  modalConfirm: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 12
  },
  confirmText: { color: "#FFF", fontWeight: "700", fontSize: 16 }
});

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default AddEvents;
