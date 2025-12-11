import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

const baseURL = "http://localhost:8080";

// Country → State Sample Data
const countryList = [
  { label: "India", value: "India" },
  { label: "USA", value: "USA" },
];

const stateList = {
  India: [
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Kerala", value: "Kerala" },
    { label: "Karnataka", value: "Karnataka" },
  ],
  USA: [
    { label: "California", value: "California" },
    { label: "Texas", value: "Texas" },
  ],
};

export default function BuyNow({ route, navigation }) {
  const { product } = route.params;

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    currency: "INR",
    quantity: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    let updatedValue = value;

    if (key === "phoneNumber") updatedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (key === "pincode") updatedValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    if (key === "quantity") updatedValue = value.replace(/[^0-9]/g, "");

    if (key === "country") {
      setForm({ ...form, country: updatedValue, state: "" });
      return;
    }

    setForm({ ...form, [key]: updatedValue });
    validateField(key, updatedValue);
  };

  const validateField = (key, value) => {
    let error = "";

    if (!value.trim() && key !== "addressLine2" && key !== "landmark") {
      error = "This field is required";
    }

    if (key === "phoneNumber" && value.length !== 10) error = "Phone number must be 10 digits";
    if (key === "pincode" && value.length !== 6) error = "Pincode must be 6 digits";

    if (key === "quantity") {
      if (!value.trim()) error = "Quantity is required";
      else if (parseInt(value) < 1) error = "Quantity must be at least 1";
    }

    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const validateFormBeforeSubmit = () => {
    let newErrors = {};
    Object.keys(form).forEach((key) => {
      const value = form[key];
      let error = "";

      if (!value.trim() && key !== "addressLine2" && key !== "landmark") {
        error = "This field is required";
      }

      if (key === "phoneNumber" && value.length !== 10) error = "Phone number must be 10 digits";
      if (key === "pincode" && value.length !== 6) error = "Pincode must be 6 digits";

      if (key === "quantity") {
        if (!value.trim()) error = "Quantity is required";
        else if (parseInt(value) < 1) error = "Quantity must be at least 1";
      }

      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFormBeforeSubmit()) {
      alert("Please fix errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const orderData = {
        ...form,
        quantity: undefined,
        items: [
          {
            productId: product.id,
            quantity: parseInt(form.quantity),
          },
        ],
      };

      await axios.post(`${baseURL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLoading(false);
      alert("Order placed successfully!");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log("Order Submit Error:", error);
      alert("Error placing order");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Enter Delivery Details</Text>

      {/* Auto-generated Text Inputs */}
      {Object.keys(form).map((key) =>
        key !== "currency" &&
        key !== "quantity" &&
        key !== "city" &&
        key !== "state" &&
        key !== "country" ? (
          <View key={key}>
            <TextInput
              placeholder={key}
              style={[styles.input, errors[key] ? styles.errorInput : null]}
              value={form[key]}
              onChangeText={(value) => handleChange(key, value)}
            />
            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
          </View>
        ) : null
      )}

      {/* Quantity */}
      <View>
        <TextInput
          placeholder="Quantity"
          keyboardType="numeric"
          style={[styles.input, errors.quantity ? styles.errorInput : null]}
          value={form.quantity}
          onChangeText={(value) => handleChange("quantity", value)}
        />
        {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
      </View>

      {/* City (TextInput instead of dropdown) */}
      <TextInput
        placeholder="City"
        style={[styles.input, errors.city ? styles.errorInput : null]}
        value={form.city}
        onChangeText={(value) => handleChange("city", value)}
      />
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

      {/* State Dropdown */}
      <Text style={styles.label}>State</Text>
      <RNPickerSelect
        onValueChange={(value) => handleChange("state", value)}
        items={stateList[form.country] || []}
        value={form.state}
        style={pickerStyles}
      />

      {/* Country Dropdown */}
      <Text style={styles.label}>Country</Text>
      <RNPickerSelect
        onValueChange={(value) => handleChange("country", value)}
        items={countryList}
        value={form.country}
        style={pickerStyles}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading ? { opacity: 0.6 } : null]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Submitting..." : "Submit Order"}</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginBottom: 10 },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  backButton: { backgroundColor: "#6c757d" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

const pickerStyles = {
  inputAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    color: "#000",
    marginBottom: 10,
  },
};
