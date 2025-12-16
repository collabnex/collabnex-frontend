import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../../global/services/env";

export default function SellProductForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imagePath: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };



  // ⭐ IMAGE PICKER FUNCTION
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setForm({ ...form, imagePath: uri });
    }
  };

  // ⭐ FORM VALIDATION
  const validateForm = () => {
    if (!form.title || !form.description || !form.price || !form.stock || !form.category) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }

    if (isNaN(form.price) || parseFloat(form.price) <= 0) {
      Alert.alert("Error", "Price must be a valid number.");
      return false;
    }

    if (isNaN(form.stock) || parseInt(form.stock) < 0) {
      Alert.alert("Error", "Stock must be a valid number.");
      return false;
    }

    return true;
  };

  // ⭐ SUBMIT FORM
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "You need to login first");
        setLoading(false);
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        imagePath: form.imagePath,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/physical-products`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Product uploaded successfully!");
      console.log("Saved product:", response.data);
    } catch (error) {
      console.log("Upload error:", error);
      Alert.alert("Error", "Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ RESET FORM FUNCTION
  const handleReset = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      imagePath: "",
    });
    Alert.alert("Reset", "Form has been cleared.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell Your Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={form.title}
        onChangeText={(t) => handleChange("title", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={form.description}
        onChangeText={(t) => handleChange("description", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="decimal-pad"
        value={form.price}
        onChangeText={(t) => handleChange("price", t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Stock Quantity"
        keyboardType="numeric"
        value={form.stock}
        onChangeText={(t) => handleChange("stock", t)}
      />

      {/* CATEGORY DROPDOWN */}
      <View style={{ marginTop: 10, marginBottom: 20 }}>
        <RNPickerSelect
          placeholder={{ label: "Select Category", value: null }}
          value={form.category}
          onValueChange={(val) => handleChange("category", val)}
          items={[
            { label: "Handmade Crafts", value: "Handmade Crafts" },
            { label: "Digital Art", value: "Digital Art" },
            { label: "Paintings", value: "Paintings" },
            { label: "Sculptures", value: "Sculptures" },
            { label: "Photography", value: "Photography" },
          ]}
          style={pickerStyles}
        />
      </View>

      {/* IMAGE PICKER */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={{ color: "white", fontSize: 16 }}>Choose Image</Text>
      </TouchableOpacity>

      {form.imagePath ? (
        <Image
          source={{ uri: form.imagePath }}
          style={{ width: 120, height: 120, marginTop: 10, borderRadius: 10 }}
        />
      ) : null}

      {/* SUBMIT BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {loading ? "Uploading..." : "Upload Product"}
        </Text>
      </TouchableOpacity>

      {/* RESET BUTTON */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={{ color: "white", fontSize: 16 }}>Reset Form</Text>
      </TouchableOpacity>
    </View>
  );
}

// =============================
// 📌 STYLES
// =============================
const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: "purple",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  resetButton: {
    backgroundColor: "grey",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "white", fontSize: 16 },
});

const pickerStyles = {
  inputIOS: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  inputAndroid: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  placeholder: {
    color: "#888",
  },
};
