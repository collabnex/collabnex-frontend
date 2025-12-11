// SellServiceScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const BASE_URL = "http://localhost:8080/api";
const categories = [
  "Web Development",
  "Design",
  "Marketing",
  "Writing",
  "Other",
];

const SellServiceScreen = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    category: "",
    customCategory: "",
    imagePath: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Form Validation
  // -------------------------------
  useEffect(() => {
    const newErrors = {};

    // Title
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";
    else if (form.title.trim().length > 50)
      newErrors.title = "Title cannot exceed 50 characters";
    else if (!/^[A-Za-z0-9 ,\-]+$/.test(form.title.trim()))
      newErrors.title = "Invalid characters in title";

    // Description
    if (!form.description.trim())
      newErrors.description = "Description is required";

    // Price

    if (!form.price.trim()) {
      newErrors.price = "Price is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.price.trim())) {
      newErrors.price = "Price must be a valid number (up to 2 decimals)";
    } else if (parseFloat(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    // Delivery Time
    if (!form.deliveryTime.trim())
      newErrors.deliveryTime = "Delivery time is required";
    else if (parseInt(form.deliveryTime) > 30)
      newErrors.deliveryTime = "Delivery time cannot exceed 30 days";

    // Category
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (form.category === "Other" && !form.customCategory.trim())
      newErrors.customCategory = "Custom category is required";

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [form]);

  // -------------------------------
  // Image Picker
  // -------------------------------
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm({ ...form, imagePath: result.assets[0].uri });
    }
  };

  const removeImage = () => {
    setForm({ ...form, imagePath: "" });
  };

  // -------------------------------
  // Submit Form
  // -------------------------------
  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting."
      );
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Authentication Error",
          "User token not found. Please login."
        );
        setLoading(false);
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        deliveryTimeDays: parseInt(form.deliveryTime),
        category:
          form.category === "Other"
            ? form.customCategory.trim()
            : form.category.trim(),
        imagePath: form.imagePath, // use URI like SellProduct.js
      };

      const response = await axios.post(
        `${BASE_URL}/service-products`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Service listed successfully!");
      console.log("Response:", response.data);

      // Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        deliveryTime: "",
        category: "",
        customCategory: "",
        imagePath: "",
      });
    } catch (error) {
      console.log("Sell Service Error:", error.response || error.message);
      const message = error.response?.data?.message || "Something went wrong";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Sell Your Service</Text>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={[styles.input, errors.title && styles.errorInput]}
        placeholder="Enter service title"
        value={form.title}
        onChangeText={(value) => setForm({ ...form, title: value })}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          errors.description && styles.errorInput,
        ]}
        placeholder="Enter service description"
        value={form.description}
        onChangeText={(value) => setForm({ ...form, description: value })}
        multiline
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}

      {/* Price */}
      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={[styles.input, errors.price && styles.errorInput]}
        placeholder="Enter price"
        value={form.price}
        keyboardType="decimal-pad"
        onChangeText={(value) => {
          // Remove invalid characters
          let formattedValue = value.replace(/[^0-9.]/g, "");

          // Prevent multiple dots
          const parts = formattedValue.split(".");
          if (parts.length > 2) {
            formattedValue = parts[0] + "." + parts[1];
          }

          // Limit to 2 decimal places
          if (parts[1] && parts[1].length > 2) {
            formattedValue = parts[0] + "." + parts[1].slice(0, 2);
          }

          // Fix leading dot like ".5" -> "0.5"
          if (formattedValue.startsWith(".")) {
            formattedValue = "0" + formattedValue;
          }

          // Remove unnecessary leading zeros
          formattedValue = formattedValue.replace(/^0+(\d)/, "$1");

          setForm({ ...form, price: formattedValue });
        }}
      />

      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      {/* Delivery Time */}
      <Text style={styles.label}>Delivery Time (Days)</Text>
      <TextInput
        style={[styles.input, errors.deliveryTime && styles.errorInput]}
        placeholder="Enter delivery time"
        value={form.deliveryTime}
        keyboardType="numeric"
        onChangeText={(value) =>
          setForm({ ...form, deliveryTime: value.replace(/[^0-9]/g, "") })
        }
      />
      {errors.deliveryTime && (
        <Text style={styles.errorText}>{errors.deliveryTime}</Text>
      )}

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <View
        style={[styles.pickerContainer, errors.category && styles.errorInput]}
      >
        <Picker
          selectedValue={form.category}
          onValueChange={(value) => setForm({ ...form, category: value })}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>
      {errors.category && (
        <Text style={styles.errorText}>{errors.category}</Text>
      )}

      {/* Custom Category */}
      {form.category === "Other" && (
        <>
          <TextInput
            style={[styles.input, errors.customCategory && styles.errorInput]}
            placeholder="Enter custom category"
            value={form.customCategory}
            onChangeText={(value) =>
              setForm({ ...form, customCategory: value })
            }
          />
          {errors.customCategory && (
            <Text style={styles.errorText}>{errors.customCategory}</Text>
          )}
        </>
      )}

      {/* Image Picker */}
      <Text style={styles.label}>Image (optional)</Text>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {form.imagePath ? "Change Image" : "Pick Image"}
          </Text>
        </TouchableOpacity>
        {form.imagePath ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: form.imagePath }}
              style={styles.imagePreview}
            />
            <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Submit Service"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9", flexGrow: 1 },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    alignSelf: "center",
  },
  label: { fontSize: 16, marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 10 },
  imagePickerContainer: { marginBottom: 20 },
  imagePicker: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  imagePickerText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  previewContainer: { marginTop: 10, alignItems: "center" },
  imagePreview: { width: 200, height: 200, borderRadius: 10 },
  removeButton: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "red",
    borderRadius: 5,
  },
  removeButtonText: { color: "#fff", fontWeight: "bold" },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SellServiceScreen;
