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

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);

    try {
      // 🔐 GET TOKEN (ROBUST)
      let token = await AsyncStorage.getItem("authToken");

      if (!token) token = await AsyncStorage.getItem("token");

      if (!token) {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) token = JSON.parse(userStr)?.token;
      }

      if (!token) {
        console.warn("No auth token found");
        setEvents([]);
        return;
      }

      // ✅ CORRECT ENDPOINT
      const response = await fetch(`${API_BASE_URL}/events/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error("Failed to fetch my events:", response.status);
        setEvents([]);
        return;
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching my events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}

      <View style={styles.metaRow}>
        {item.startDatetime && (
          <Text style={styles.metaText}>
            📅 {new Date(item.startDatetime).toLocaleDateString("en-GB")}
          </Text>
        )}

        <Text style={styles.metaText}>
          👥 {item.availableSeats}/{item.totalSeats}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderEvent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You haven’t created any events yet
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FB"
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  metaText: {
    fontSize: 13,
    color: "#4B5563"
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280"
  }
});

export default MyEvents;
