import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const physicalOrders = Array.isArray(response.data.physicalOrders)
        ? response.data.physicalOrders
        : [];

      setOrders(physicalOrders);
    } catch (error) {
      console.log("Error fetching orders:", error.response?.data || error);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item, index }) => (
    <View style={styles.orderCard}>
      <Text style={styles.title}>Order {index + 1}</Text>

      <Text style={styles.sectionTitle}>Customer Info</Text>
      <Text>Name: {String(item.fullName ?? "")}</Text>
      <Text>Phone: {String(item.phoneNumber ?? "")}</Text>

      <Text>
        Address: {String(item.addressLine1 ?? "")}
        {item.addressLine2 ? ", " + String(item.addressLine2) : ""}
      </Text>

      <Text>Landmark: {String(item.landmark ?? "")}</Text>

      <Text>
        City: {String(item.city ?? "")}
        {item.state ? ", " + String(item.state) : ""}
      </Text>

      <Text>Pincode: {String(item.pincode ?? "")}</Text>
      <Text>Country: {String(item.country ?? "")}</Text>

      <Text style={styles.sectionTitle}>Items</Text>

      {Array.isArray(item.items) && item.items.length > 0 ? (
        item.items.map((i, idx) => (
          <View key={`${index}-${idx}`} style={styles.itemRow}>
            <Text>Product ID: {String(i.productId ?? "")}</Text>
            <Text>Qty: {String(i.quantity ?? "")}</Text>
          </View>
        ))
      ) : (
        <Text>No items</Text>
      )}

      <Text style={styles.sectionTitle}>Payment</Text>
      <Text>Currency: {String(item.currency ?? "")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : orders.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => `${item.id ?? index}`}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  orderCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: { marginTop: 10, fontWeight: "bold", fontSize: 16 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
});
