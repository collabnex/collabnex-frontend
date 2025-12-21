import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToS3 } from "../services/imageUploadService";

import { API_BASE_URL } from "../../global/services/env";
import { Colors } from "../../global/theme/colors";

export default function SellProductForm({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imagePath: "",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      update("imagePath", result.assets[0].uri);
    }
  };

  /* ================= VALIDATION ================= */
  const errors = useMemo(() => {
    const e = {};
    if (!form.title.trim()) e.title = true;
    if (!form.description.trim()) e.description = true;
    if (!form.category) e.category = true;
    if (!form.price || Number(form.price) <= 0) e.price = true;
    if (!form.stock || Number(form.stock) < 0) e.stock = true;
    return e;
  }, [form]);

  const isFormValid = Object.keys(errors).length === 0;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Invalid form", "Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "You need to login first");
        setLoading(false);
        return;
      }

      // 🔥 STEP 1: Upload image to S3 (ONLY if image exists)
      let uploadedImageUrl = "";
      if (form.imagePath) {
        uploadedImageUrl = await uploadImageToS3(form.imagePath);
      }

      // 🔥 STEP 2: Send S3 URL to backend
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        imagePath: uploadedImageUrl, // images/uuid.jpg ✅
      };

      const response = await axios.post(`${API_BASE_URL}/physical-products`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Product uploaded successfully");
           console.log("Response:", response.data);
            // 🔄 Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        stock:"",
        category: "",
        imagePath: "",
      });

      navigation.navigate("MarketplaceHome");
      
    } catch (err) {
      Alert.alert("Error", "Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Sell a Product</Text>
      <Text style={styles.subtitle}>
        Add your product to the marketplace
      </Text>

      {/* IMAGE */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {form.imagePath ? (
          <Image source={{ uri: form.imagePath }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Tap to upload image</Text>
        )}
      </TouchableOpacity>

      <View style={styles.card}>
        {/* TITLE */}
        <TextInput
          style={[styles.input, errors.title && styles.errorInput]}
          placeholder="Product title"
          value={form.title}
          onChangeText={(t) => update("title", t)}
        />

        {/* DESCRIPTION */}
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.description && styles.errorInput,
          ]}
          placeholder="Product description"
          multiline
          value={form.description}
          onChangeText={(t) => update("description", t)}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.dropdownWrapper}>
          <RNPickerSelect
            placeholder={{ label: "Select category", value: null }}
            value={form.category}
            onValueChange={(v) => update("category", v)}
            items={[
              { label: "Handmade Crafts", value: "Handmade Crafts" },
              { label: "Digital Art", value: "Digital Art" },
              { label: "Paintings", value: "Paintings" },
              { label: "Sculptures", value: "Sculptures" },
              { label: "Photography", value: "Photography" },
            ]}
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: [
                styles.dropdownInput,
                errors.category && styles.errorInput,
              ],
              inputAndroid: [
                styles.dropdownInput,
                errors.category && styles.errorInput,
              ],
              placeholder: styles.dropdownPlaceholder,
              iconContainer: styles.dropdownIcon,
            }}
            Icon={() => <Text style={styles.dropdownArrow}>⌄</Text>}
          />
        </View>

        {/* PRICE & STOCK */}
        <Text style={styles.label}>Price & Stock</Text>
        <View style={styles.row}>
          <TextInput
            style={[
              styles.input,
              styles.half,
              errors.price && styles.errorInput,
            ]}
            placeholder="Price"
            keyboardType="numeric"
            value={form.price}
            onChangeText={(t) =>
              update("price", t.replace(/[^0-9.]/g, ""))
            }
          />

          <TextInput
            style={[
              styles.input,
              styles.half,
              errors.stock && styles.errorInput,
            ]}
            placeholder="Stock"
            keyboardType="numeric"
            value={form.stock}
            onChangeText={(t) =>
              update("stock", t.replace(/[^0-9]/g, ""))
            }
          />
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!isFormValid || loading) && styles.disabledBtn,
          ]}
          disabled={!isFormValid || loading}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {loading ? "Uploading..." : "Upload Product"}
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
    color: Colors.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 20,
  },

  imageBox: {
    height: 160,
    backgroundColor: Colors.white,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },

  imageText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
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
    marginTop: 8,
  },

  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  errorInput: {
    borderColor: Colors.error,
  },

  dropdownWrapper: {
    marginBottom: 14,
  },

  dropdownInput: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: 15,
  },

  dropdownPlaceholder: {
    color: Colors.textSecondary,
  },

  dropdownArrow: {
    fontSize: 18,
    color: Colors.textSecondary,
    paddingRight: 12,
  },

  dropdownIcon: {
    top: 18,
    right: 10,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  half: {
    flex: 1,
  },

  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  disabledBtn: {
    backgroundColor: Colors.secondary,
    opacity: 0.6,
  },

  submitText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
