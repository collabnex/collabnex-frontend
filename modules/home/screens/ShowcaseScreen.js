import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";

 




export default function ShowcaseScreen({ navigation}) {
  const [products, setProducts] = useState([]);
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}/api/physical-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  const handleBuyNow = (item) => {
    // console.log("Buying product:", item.title);
     navigation.navigate("BuyNow", { product: item });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagePath && (
        <Image
          source={{ uri: `${API_BASE_URL}/${item.imagePath}` }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.price}>₹ {item.price}</Text>
      <Text style={styles.category}>{item.category}</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleBuyNow(item)}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* 🌟 Top Page Title Added Here */}
      <Text style={styles.pageTitle}>Product Details!!</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}  // ← shows 2 items per row
       columnWrapperStyle={{ justifyContent: "space-between" }} // spacing
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },

  // 🌟 Style for Page Title
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
  },


  card: {
  width: "48%",   // ← important
  padding: 15,
  backgroundColor: "#f8f8f8",
  marginBottom: 15,
  borderRadius: 10,
  elevation: 2,
},

  image: { width: "100%", height: 180, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  desc: { fontSize: 14, color: "#555", marginVertical: 5 },
  price: { fontSize: 16, fontWeight: "bold", color: "green" },
  category: { fontSize: 14, fontStyle: "italic", color: "#444" },
  button: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
