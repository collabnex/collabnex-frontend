import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

/* 🎨 CollabNEX Theme */
const Colors = {
  primary: "#592FE4",
  success: "#2E7D32",
  background: "#F8F7FF",
  white: "#FFFFFF",
  textPrimary: "#1E1E2E",
  textSecondary: "#6B6B80",
  border: "#E5E4F0",
};

export default function MyOrdersScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  /* -------------------------------
     API
  -------------------------------- */
  const fetchMyOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.log("Fetch orders error:", e.response?.data || e);
      Alert.alert("Error", "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     Helpers
  -------------------------------- */
  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString() + " • " + d.toLocaleTimeString();
  };

  /* -------------------------------
     Render Card
  -------------------------------- */
  const renderItem = ({ item }) => {
    const isService = !!item.serviceProduct;
    const service = item.serviceProduct;
    const product = item.physicalProduct; // future-proof

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.rowBetween}>
          <Text style={styles.title}>
            {isService ? service?.title : product?.name}
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: isService ? "#EDE9FF" : "#E8F5E9",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isService ? Colors.primary : Colors.success },
              ]}
            >
              {isService ? "ENQUIRY" : "ORDER"}
            </Text>
          </View>
        </View>

        {/* CATEGORY */}
        <Text style={styles.meta}>
          {isService ? service?.category : "Physical Product"}
        </Text>

        {/* PRICE */}
        <Text style={styles.price}>
          ₹{isService ? service?.price : product?.price}
        </Text>

        {/* ARTIST */}
        <Text style={styles.meta}>
          Artist:{" "}
          {isService
            ? service?.user?.email
            : product?.seller?.email}
        </Text>

        {/* MESSAGE (SERVICE ONLY) */}
        {isService && item.message ? (
          <Text style={styles.message}>
            Message: {item.message}
          </Text>
        ) : null}

        {/* DELIVERY / QTY */}
        {isService ? (
          <Text style={styles.meta}>
            Delivery Time: {service?.deliveryTimeDays} days
          </Text>
        ) : (
          <Text style={styles.meta}>
            Quantity: {product?.quantity}
          </Text>
        )}

        {/* TIME */}
        <Text style={styles.time}>
          {isService ? "Enquired on" : "Ordered on"}{" "}
          {formatDateTime(item.createdAt)}
        </Text>
      </View>
    );
  };

  /* -------------------------------
     UI
  -------------------------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No enquiries or orders found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

/* -------------------------------
   STYLES
-------------------------------- */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  meta: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  price: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },

  message: {
    marginTop: 8,
    fontStyle: "italic",
    color: Colors.textPrimary,
  },

  time: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "right",
  },
});
