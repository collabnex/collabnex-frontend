import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

const MyEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      let token =
        (await AsyncStorage.getItem("authToken")) ||
        (await AsyncStorage.getItem("token"));

      if (!token) {
        setEvents([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/events/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("MyEventdetails", {
          eventId: item.id,
          eventTitle: item.title
        })
      }
    >
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.activeBtn}>
          <Text style={styles.activeText}>My Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("AddEvents")}
        >
        <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate("EventsScreen")}
  ></TouchableOpacity>
        
        
          <Text style={styles.primaryText}>Add Event</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FB" },

  topBar: { flexDirection: "row", marginBottom: 16 },
  activeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    marginRight: 8
  },
  activeText: { fontSize: 16, fontWeight: "700" },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
    marginLeft: 8
  },
  primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  description: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  metaText: { fontSize: 13, color: "#4B5563" },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280"
  }
});

export default MyEvents;
