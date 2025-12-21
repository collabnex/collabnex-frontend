import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

const MyEventdetails = ({ route }) => {
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  /* =========================
     FETCH BOTH APIs
  ========================= */
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token =
        (await AsyncStorage.getItem("authToken")) ||
        (await AsyncStorage.getItem("token"));

      if (!token) return;

      /* 🔹 EVENT DETAILS */
      const eventRes = await fetch(
        `${API_BASE_URL}/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const eventData = await eventRes.json();
      setEvent(eventData);

      /* 🔹 BOOKINGS */
      const bookingRes = await fetch(
        `${API_BASE_URL}/event-bookings/received`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const bookingData = await bookingRes.json();

      const filteredBookings = Array.isArray(bookingData)
        ? bookingData.filter((b) => b.eventId === eventId)
        : [];

      setBookings(filteredBookings);
    } catch (err) {
      setEvent(null);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CALCULATIONS
  ========================= */
  const ticketsSold = bookings.length;
  const seatsLeft = event?.availableSeats || 0;
  const totalSeats = seatsLeft + ticketsSold;
  const revenue = ticketsSold * (event?.ticketPrice || 0);

  /* =========================
     RENDER BOOKING
  ========================= */
  const renderBooking = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.metaText}>
        🎟 Booking ID: {item.bookingId}
      </Text>
      <Text style={styles.metaText}>
        💰 Ticket Price: ₹{item.ticketPrice}
      </Text>
      <Text style={styles.metaText}>
        📅 Booked At: {item.bookedAt || "N/A"}
      </Text>
    </View>
  );

  if (loading || !event) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* EVENT HEADER */}
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDesc}>{event.description}</Text>

      {/* STATS */}
      <View style={styles.statsCard}>
        <Stat label="Total Seats" value={totalSeats} />
        <Stat label="Tickets Sold" value={ticketsSold} />
        <Stat label="Seats Left" value={seatsLeft} />
      </View>

      {/* REVENUE */}
      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Total Revenue</Text>
        <Text style={styles.revenueValue}>₹{revenue}</Text>
      </View>

      {/* BOOKINGS LIST */}
      <Text style={styles.sectionTitle}>Bookings</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.bookingId.toString()}
        renderItem={renderBooking}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No bookings received yet
          </Text>
        }
      />
    </View>
  );
};

export default MyEventdetails;

/* =========================
   SMALL STAT COMPONENT
========================= */
const Stat = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  eventTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4
  },
  eventDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16
  },

  statsCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  statItem: {
    flex: 1,
    alignItems: "center"
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#007AFF"
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4
  },

  revenueCard: {
    backgroundColor: "#DCFCE7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: "center"
  },
  revenueLabel: {
    fontSize: 14,
    color: "#166534"
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#166534"
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },

  bookingCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },
  metaText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#6B7280"
  }
});
