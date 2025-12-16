// SellServiceScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
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
import RNPickerSelect from "react-native-picker-select";

import { API_BASE_URL } from "../../global/services/env";
import { Colors } from "../../global/theme/colors";

const categories = [
  "Web Development",
  "Design",
  "Marketing",
  "Writing",
  "Other",
];

export default function SellServiceScreen({ navigation }) {
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

  /* ================= VALIDATION ================= */
  useEffect(() => {
    const e = {};

    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length < 3) e.title = "Min 3 characters";

    if (!form.description.trim()) e.description = "Description required";

    if (!form.price.trim()) e.price = "Price required";
    else if (!/^\d+(\.\d{1,2})?$/.test(form.price))
      e.price = "Invalid price";
    else if (+form.price <= 0) e.price = "Must be greater than 0";

    if (!form.deliveryTime.trim()) e.deliveryTime = "Required";
    else if (+form.deliveryTime > 30) e.deliveryTime = "Max 30 days";

    if (!form.category) e.category = "Category required";
    if (form.category === "Other" && !form.customCategory.trim())
      e.customCategory = "Required";

    setErrors(e);
    setIsFormValid(Object.keys(e).length === 0);
  }, [form]);

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
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

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        deliveryTimeDays: parseInt(form.deliveryTime),
        category:
          form.category === "Other"
            ? form.customCategory.trim()
            : form.category,
        imagePath: form.imagePath,
      };

      await axios.post(`${API_BASE_URL}/service-products`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Service listed successfully");
      navigation.replace("Marketplace");
    } catch (err) {
      Alert.alert("Error", "Failed to submit service");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Sell a Service</Text>
      <Text style={styles.subtitle}>
        Showcase your skills & start earning
      </Text>

      {/* IMAGE */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {form.imagePath ? (
          <Image source={{ uri: form.imagePath }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Tap to upload image</Text>
        )}
      </TouchableOpacity>

      {form.imagePath && (
        <TouchableOpacity onPress={removeImage}>
          <Text style={styles.removeText}>Remove image</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <TextInput
          style={[styles.input, errors.title && styles.error]}
          placeholder="Service title"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
        />

        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.description && styles.error,
          ]}
          placeholder="Service description"
          multiline
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <RNPickerSelect
          placeholder={{ label: "Select category", value: null }}
          value={form.category}
          onValueChange={(v) => setForm({ ...form, category: v })}
          items={categories.map((c) => ({ label: c, value: c }))}
          useNativeAndroidPickerStyle={false}
          style={pickerStyles(errors.category)}
          Icon={() => <Text style={styles.arrow}>⌄</Text>}
        />

        {form.category === "Other" && (
          <TextInput
            style={[styles.input, errors.customCategory && styles.error]}
            placeholder="Custom category"
            value={form.customCategory}
            onChangeText={(v) =>
              setForm({ ...form, customCategory: v })
            }
          />
        )}

        {/* PRICE + DELIVERY */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half, errors.price && styles.error]}
            placeholder="Price"
            keyboardType="numeric"
            value={form.price}
            onChangeText={(v) =>
              setForm({
                ...form,
                price: v.replace(/[^0-9.]/g, ""),
              })
            }
          />

          <TextInput
            style={[
              styles.input,
              styles.half,
              errors.deliveryTime && styles.error,
            ]}
            placeholder="Delivery (days)"
            keyboardType="numeric"
            value={form.deliveryTime}
            onChangeText={(v) =>
              setForm({
                ...form,
                deliveryTime: v.replace(/[^0-9]/g, ""),
              })
            }
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.disabled,
          ]}
          disabled={!isFormValid || loading}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Publish Service"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.textPrimary,
  },
  subtitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  imageBox: {
    height: 160,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%", borderRadius: 18 },
  imageText: { color: Colors.textSecondary, fontWeight: "600" },
  removeText: {
    color: Colors.error,
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  error: { borderColor: Colors.error },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  disabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: Colors.textSecondary,
    paddingRight: 12,
  },
});

const pickerStyles = (hasError) => ({
  inputIOS: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: hasError ? Colors.error : Colors.border,
    marginBottom: 14,
  },
  inputAndroid: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: hasError ? Colors.error : Colors.border,
    marginBottom: 14,
  },
});
