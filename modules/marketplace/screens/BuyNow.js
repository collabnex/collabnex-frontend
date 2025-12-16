import React, { useState, useMemo } from "react";
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
import { API_BASE_URL } from "../../global/services/env";

/* 🎨 CollabNEX Theme */
const Colors = {
  primary: "#592FE4",
  secondary: "#8F7BFF",
  background: "#F8F7FF",
  white: "#FFFFFF",
  textPrimary: "#1E1E2E",
  textSecondary: "#6B6B80",
  border: "#E5E4F0",
  error: "#E53935",
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
    quantity: "",
  });

  /* -------------------------------
     INPUT CHANGE (SANITIZED)
  -------------------------------- */
  const update = (key, value) => {
    let v = value;

    if (key === "phoneNumber") v = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (key === "pincode") v = value.replace(/[^0-9]/g, "").slice(0, 6);
    if (key === "quantity") v = value.replace(/[^0-9]/g, "");

    setForm((p) => ({ ...p, [key]: v }));
  };

  /* -------------------------------
     VALIDATION (SILENT)
  -------------------------------- */
  const isValid = useMemo(() => {
    if (!form.fullName.trim()) return false;
    if (form.phoneNumber.length !== 10) return false;
    if (!form.addressLine1.trim()) return false;
    if (form.pincode.length !== 6) return false;
    if (!form.city.trim()) return false;
    if (!form.state.trim()) return false;
    if (!form.country.trim()) return false;
    if (!form.quantity || parseInt(form.quantity) < 1) return false;
    return true;
  }, [form]);

  /* -------------------------------
     SUBMIT
  -------------------------------- */
  const submitOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const payload = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber,
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        landmark: form.landmark.trim(),
        pincode: form.pincode,
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        currency: "INR",
        items: [
          {
            productId: product.id,
            quantity: parseInt(form.quantity),
          },
        ],
      };

      await axios.post(`${API_BASE_URL}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Order placed successfully");
      navigation.goBack();
    } catch (e) {
      console.log(e);
      alert("❌ Failed to place order");
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Delivery Details</Text>
      <Text style={styles.subtitle}>Complete your order securely</Text>

      <View style={styles.card}>
        <Field label="Full Name" required>
          <Input value={form.fullName} onChange={(v) => update("fullName", v)} />
        </Field>

        <Field label="Phone Number" required>
          <Input
            keyboardType="numeric"
            value={form.phoneNumber}
            onChange={(v) => update("phoneNumber", v)}
          />
        </Field>

        <Field label="Address Line 1" required>
          <Input
            value={form.addressLine1}
            onChange={(v) => update("addressLine1", v)}
          />
        </Field>

        <Field label="Address Line 2">
          <Input
            value={form.addressLine2}
            onChange={(v) => update("addressLine2", v)}
          />
        </Field>

        <Field label="Landmark">
          <Input
            value={form.landmark}
            onChange={(v) => update("landmark", v)}
          />
        </Field>

        <Field label="Pincode" required>
          <Input
            keyboardType="numeric"
            value={form.pincode}
            onChange={(v) => update("pincode", v)}
          />
        </Field>

        <Field label="City" required>
          <Input value={form.city} onChange={(v) => update("city", v)} />
        </Field>

        <Field label="State" required>
          <Input value={form.state} onChange={(v) => update("state", v)} />
        </Field>

        <Field label="Country" required>
          <Input value={form.country} onChange={(v) => update("country", v)} />
        </Field>

        <Field label="Quantity" required>
          <Input
            keyboardType="numeric"
            value={form.quantity}
            onChange={(v) => update("quantity", v)}
          />
        </Field>

        <TouchableOpacity
          disabled={!isValid}
          style={[
            styles.button,
            !isValid && { opacity: 0.5 },
          ]}
          onPress={submitOrder}
        >
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* -------------------------------
   REUSABLE COMPONENTS
-------------------------------- */
const Field = ({ label, required, children }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>
      {label} {required && <Text style={{ color: Colors.error }}>*</Text>}
    </Text>
    {children}
  </View>
);

const Input = ({ value, onChange, keyboardType }) => (
  <TextInput
    value={value}
    onChangeText={onChange}
    keyboardType={keyboardType}
    style={styles.input}
    placeholderTextColor={Colors.textSecondary}
  />
);

/* -------------------------------
   STYLES
-------------------------------- */
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

  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },

  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
