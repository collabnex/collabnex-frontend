import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* =========================
   CONSTANTS (ADDED)
========================= */
const BOOKED_EVENTS_KEY = "BOOKED_EVENTS";

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
    } catch {
      continue;
    }
  }
  return null;
};

/* =========================
   EVENTS SCREEN
========================= */
const EventsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  /* ===== ADDED ===== */
  const [bookedEventIds, setBookedEventIds] = useState([]);

  useEffect(() => {
    fetchEvents();
    loadBookedEvents(); // ADDED
  }, []);

  /* ===== ADDED ===== */
  const loadBookedEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKED_EVENTS_KEY);
      if (stored) {
        setBookedEventIds(JSON.parse(stored));
      }
    } catch {}
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        setEvents([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async () => {
    setShowConfirm(false);

    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/event-bookings/${selectedEventId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) return;

      /* ===== ADDED ===== */
      setBookedEventIds((prev) => {
        const updated = [...new Set([...prev, selectedEventId])];
        AsyncStorage.setItem(
          BOOKED_EVENTS_KEY,
          JSON.stringify(updated)
        );
        return updated;
      });

      setShowSuccess(true);
    } catch {}
  };

  const bookEventAndNavigate = (eventId) => {
    setSelectedEventId(eventId);
    setShowConfirm(true);
  };

  const renderEvent = ({ item }) => {
    /* ===== ADDED ===== */
    const isBooked = bookedEventIds.includes(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>

        {item.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.metaRow}>
          {item.locationText && (
            <Text style={styles.metaText}>📍 {item.locationText}</Text>
          )}
          {item.startDatetime && (
            <Text style={styles.metaText}>
              📅 {formatDate(item.startDatetime)}
            </Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceText}>₹{item.ticketPrice ?? 0}</Text>
            <Text style={styles.seatsText}>
              {item.availableSeats ?? 0}/{item.totalSeats ?? 0} seats
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.bookBtn,
              (item.availableSeats === 0 || isBooked) &&
                styles.bookBtnDisabled
            ]}
            disabled={item.availableSeats === 0 || isBooked}
            onPress={() => bookEventAndNavigate(item.id)}
          >
            <Text style={styles.bookBtnText}>
              {isBooked
                ? "Already Booked"
                : item.availableSeats === 0
                ? "Sold Out"
                : "Book Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.button,
            route.name === "MyEvents" && styles.activeTab
          ]}
          onPress={() => navigation.navigate("MyEvents")}
        >
          <Text style={styles.buttonText}>My Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate("AddEvents")}
        >
          <Text style={styles.buttonPrimaryText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events available</Text>
          }
        />
      )}

      {/* CONFIRM MODAL */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to book this event?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={confirmBooking}
              >
                <Text style={styles.confirmText}>YES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.modalTitle}>Booked Successfully</Text>
            <Text style={styles.modalSubtitle}>
              Your ticket has been booked.
            </Text>

            <TouchableOpacity
              style={styles.modalConfirm}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate("EventDetails", {
                  eventId: selectedEventId
                });
              }}
            >
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* =========================
   HELPERS
========================= */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB");

const StatusBadge = ({ status }) => (
  <View
    style={[
      styles.badge,
      status === "PUBLISHED" && styles.badgePublished
    ]}
  >
    <Text style={styles.badgeText}>{status}</Text>
  </View>
);

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FB" },
  topBar: { flexDirection: "row", marginBottom: 16 },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    marginRight: 8
  },
  buttonPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center"
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
  buttonPrimaryText: { fontSize: 16, fontWeight: "600", color: "#FFF" },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  eventTitle: { fontSize: 18, fontWeight: "700" },
  eventDescription: { color: "#6B7280", marginVertical: 8 },
  metaRow: { marginBottom: 12 },
  metaText: { fontSize: 13, color: "#4B5563" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  priceText: { fontSize: 18, fontWeight: "700" },
  seatsText: { fontSize: 12, color: "#6B7280" },
  bookBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12
  },
  bookBtnDisabled: { backgroundColor: "#9CA3AF" },
  bookBtnText: { color: "#FFF", fontWeight: "700" },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#E5E7EB"
  },
  badgePublished: { backgroundColor: "#DCFCE7" },
  badgeText: { fontSize: 11, fontWeight: "600", color: "#166534" },

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
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between"
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
    alignItems: "center"
  },
  modalConfirm: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#16A34A",
    alignItems: "center"
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600"
  },

  cancelText: { fontWeight: "700", color: "#374151" },
  confirmText: { fontWeight: "700", color: "#FFF" },
  successIcon: { fontSize: 40, marginBottom: 8 }
});

export default EventsScreen;
