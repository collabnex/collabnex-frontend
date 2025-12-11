import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MarketplaceScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080";

  // 📐 Responsive Screen Info
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numColumns = isTablet ? 3 : 2;

  const CARD_MARGIN = 10;
  const cardWidth = (width - CARD_MARGIN * (numColumns + 1)) / numColumns;

  useEffect(() => {
    loadServices();
  }, []);

  // 🚀 Load Services from Backend
  const loadServices = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Authentication Required", "Please login again.");
        navigation.replace("Login");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/service-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(res.data);
    } catch (error) {
      console.log("FETCH ERROR:", error.response?.data || error);
      Alert.alert("Error", "Unable to load services.");
    } finally {
      setLoading(false);
    }
  };

  // 🔵 BUY NOW → Navigate to BuyNowScreen
  const handleBuyNow = (item) => {
    navigation.navigate("BuyNowScreen", {
      serviceProductId: item.id,
      title: item.title,
    });
  };

  // 🟣 Correct image generator (backend returns local blob)
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300";
    return `${BASE_URL}/${path}`;
  };

  // 🟡 Card Component
  const renderCard = ({ item }) => {
    return (
      <View style={[styles.card, { width: cardWidth }]}>
        <Image
          source={{ uri: getImageUrl(item.imagePath) }}
          style={styles.cardImage}
        />

        <Text style={styles.cardTitle}>{item.title}</Text>

        <Text numberOfLines={2} style={styles.cardDesc}>
          {item.description}
        </Text>

        <Text style={styles.cardPrice}>₹ {item.price}</Text>

        <Text style={styles.cardDelivery}>
          Delivery: {item.deliveryTimeDays} days
        </Text>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => handleBuyNow(item)}
        >
          <Text style={styles.buyText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ⏳ Loader
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔵 TOP BUTTONS */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SellProduct")}
          style={[styles.topBtn, { backgroundColor: "#8000FF" }]}
        >
          <Text style={styles.topBtnText}>Sell Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SellServices")}
          style={[styles.topBtn, { backgroundColor: "#FF6B00" }]}
        >
          <Text style={styles.topBtnText}>Sell Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("MyOrders")}
          style={[styles.topBtn, { backgroundColor: "rgba(69,187,30,1)" }]}
        >
          <Text style={styles.topBtnText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      {/* 🟡 RESPONSIVE GRID LIST */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// 🌟 STYLES
const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  topBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 3,
  },
  topBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  // 🟦 CARD
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
  },

  // 🖼 Responsive Image (Square, looks premium)
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  cardTitle: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  cardDesc: { fontSize: 12, color: "#555", marginTop: 3 },
  cardPrice: {
    fontSize: 16,
    color: "#008000",
    fontWeight: "bold",
    marginTop: 5,
  },
  cardDelivery: { fontSize: 12, color: "#777", marginTop: 3 },

  buyBtn: {
    marginTop: 10,
    backgroundColor: "#FF9900",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buyText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});

export default MarketplaceScreen;
