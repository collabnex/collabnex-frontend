import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* =========================
   EVENTS SCREEN
========================= */

const EventsScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  /* =========================
     FETCH ALL EVENTS (AUTH)
  ========================= */
  const fetchEvents = async () => {
  setLoading(true);

  try {
    // 🔍 Try multiple possible token locations
    let token = await AsyncStorage.getItem("authToken");

    if (!token) {
      token = await AsyncStorage.getItem("token");
    }

    if (!token) {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user?.token || user?.accessToken;
      }
    }

    if (!token) {
      console.warn("Auth token not found in storage");
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
      console.error("Failed to fetch events:", response.status);
      setEvents([]);
      return;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : [];

    setEvents(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching events:", error);
    setEvents([]);
  } finally {
    setLoading(false);
  }
};


  /* =========================
     EVENT CARD
  ========================= */
  const renderEvent = ({ item }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>

      {/* DESCRIPTION */}
      {item.description ? (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      {/* META */}
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

      {/* FOOTER */}
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
          onPress={() =>
            navigation.navigate("BuyNow", { eventId: item.id })
          }
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
          style={styles.button}
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

      {/* EVENTS LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id?.toString()}
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
