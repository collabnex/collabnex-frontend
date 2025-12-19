import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
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

  useEffect(() => {
    fetchEvents();
  }, []);

  /* =========================
     FETCH EVENTS
  ========================= */
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();

      if (!token) {
        Alert.alert("Login Required", "Please login to view events");
        setEvents([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setEvents([]);
        return;
      }

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     BOOK EVENT
  ========================= */
  const bookEventAndNavigate = async (eventId) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      Alert.alert("Login Required", "Please login again");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/event-bookings/${eventId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔴 Handle backend 500 as "Already Booked"
    if (response.status === 500) {
      Alert.alert(
        "Already Booked",
        "You have already booked a ticket for this event."
      );
      return;
    }

    if (response.status === 409) {
      Alert.alert(
        "Already Booked",
        "You have already booked a ticket for this event."
      );
      return;
    }

    if (response.status === 400 || response.status === 422) {
      const message = await response.text();
      Alert.alert("Booking Failed", message || "No seats available");
      return;
    }

    if (response.status === 401) {
      Alert.alert("Session Expired", "Please login again");
      return;
    }

    if (!response.ok) {
      const text = await response.text();
      Alert.alert("Booking Failed", text || "Could not book event");
      return;
    }

    Alert.alert("Success", "Your ticket has been booked!");
    navigation.navigate("EventDetails", { eventId });

  } catch (error) {
    Alert.alert("Error", "Something went wrong while booking");
  }
};





  /* =========================
     EVENT CARD
  ========================= */
  const renderEvent = ({ item }) => (
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
            item.availableSeats === 0 && styles.bookBtnDisabled
          ]}
          disabled={item.availableSeats === 0}
          onPress={() => bookEventAndNavigate(item.id)}
        >
          <Text style={styles.bookBtnText}>
            {item.availableSeats === 0 ? "Sold Out" : "Book Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.button,
            route.name === "MyEvents" && styles.activeTab
          ]}
          onPress={() => navigation.navigate("MyEvents")}
        >
          <Text
            style={[
              styles.buttonText,
              route.name === "MyEvents" && styles.activeText
            ]}
          >
            My Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            route.name === "AddEvents" && styles.activePrimary
          ]}
          onPress={() => navigation.navigate("AddEvents")}
        >
          <Text style={styles.buttonPrimaryText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      {/* EVENTS LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events available</Text>
          }
        />
      )}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FB"
  },
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
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
    marginLeft: 8
  },
  activeTab: {
    backgroundColor: "#D1D5DB"
  },
  activeText: {
    fontWeight: "700"
  },
  activePrimary: {
    backgroundColor: "#005FCC"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600"
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1
  },
  eventDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginVertical: 8
  },
  metaRow: {
    marginBottom: 12
  },
  metaText: {
    fontSize: 13,
    color: "#4B5563"
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700"
  },
  seatsText: {
    fontSize: 12,
    color: "#6B7280"
  },
  bookBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  bookBtnDisabled: {
    backgroundColor: "#9CA3AF"
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#E5E7EB"
  },
  badgePublished: {
    backgroundColor: "#DCFCE7"
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534"
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
    fontSize: 16
  }
});

export default EventsScreen;
