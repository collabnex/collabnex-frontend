import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* =========================
   TOKEN HELPER
========================= */
const getAuthToken = async () => {
  const keys = await AsyncStorage.getAllKeys();
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    if (!value) continue;

    if (value.startsWith("ey")) return value;

    try {
      const parsed = JSON.parse(value);
      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
      if (parsed?.jwt) return parsed.jwt;
    } catch {}
  }
  return null;
};

/* =========================
   EVENT DETAILS
========================= */
const EventDetails = ({ route }) => {
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        setEvent(null);
        return;
      }

      setEvent(await response.json());
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        {event.status && (
          <Text style={styles.status}>{event.status}</Text>
        )}
      </View>

      {/* DETAILS */}
      <View style={styles.card}>
        <Section label="Description" value={event.description} />
        <Section label="Event Type" value={event.eventType} />
        <Section
          label="Start Date"
          value={formatDate(event.startDatetime)}
        />
        <Section
          label="End Date"
          value={formatDate(event.endDatetime)}
        />
        <Section label="Location" value={event.locationText} />
        {event.onlineLink && (
          <Section label="Online Link" value={event.onlineLink} />
        )}
      </View>

      {/* META */}
      <View style={styles.card}>
        <Section
          label="Ticket Price"
          value={
            event.ticketPrice > 0
              ? `₹${event.ticketPrice} ${event.currency ?? ""}`
              : "Free"
          }
        />
        <Section
          label="Seats"
          value={`${event.availableSeats ?? 0} / ${event.totalSeats ?? 0}`}
        />
        {event.host?.email && (
          <Section label="Hosted By" value={event.host.email} />
        )}
      </View>
    </ScrollView>
  );
};

/* =========================
   SECTION
========================= */
const Section = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

/* =========================
   HELPERS
========================= */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB");

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  empty: {
    fontSize: 15,
    color: "#64748B"
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8
  },
  status: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    color: "#1E40AF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  section: {
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 4
  },
  value: {
    fontSize: 15,
    color: "#0F172A",
    lineHeight: 22
  }
});

export default EventDetails;
