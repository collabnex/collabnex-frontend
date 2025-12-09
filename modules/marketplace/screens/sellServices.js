// SellServiceScreen.js
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = 'http://192.168.29.150:8080/api';
const categories = ['Web Development', 'Design', 'Marketing', 'Writing', 'Other'];

const SellServiceScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // -------------------------------
  // Validation
  // -------------------------------
  useEffect(() => {
    const newErrors = {};
    if (!title.trim()) {
  newErrors.title = "Title is required";
} else if (title.trim().length < 3) {
  newErrors.title = "Title must be at least 3 characters";
} else if (title.trim().length > 50) {
  newErrors.title = "Title cannot exceed 50 characters";
} else if (!/^[A-Za-z0-9 ,\-]+$/.test(title.trim())) {
  newErrors.title = "Invalid characters in title";
}
    if (!description.trim()) newErrors.description = 'Description is required';

    if (!price.trim()) newErrors.price = 'Price is required';
    else if (!/^\d*\.?\d{0,2}$/.test(price))
      newErrors.price = 'Only numbers with up to 2 decimals allowed';

    if (!deliveryTime.trim()) newErrors.deliveryTime = 'Delivery time is required';
    else if (parseInt(deliveryTime) > 30)
      newErrors.deliveryTime = 'Delivery time cannot exceed 30 days';

    if (!category.trim()) newErrors.category = 'Category is required';
    if (category === 'Other' && !customCategory.trim())
      newErrors.customCategory = 'Custom category is required';

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [title, description, price, deliveryTime, category, customCategory]);

  // -------------------------------
  // Image Picker with preview
  // -------------------------------
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  // -------------------------------
  // Submit Form
  // -------------------------------
  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fill all fields correctly.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Authentication Error', 'User token not found. Please login.');
        return;
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        deliveryTimeDays: parseInt(deliveryTime),
        category: category === 'Other' ? customCategory.trim() : category.trim(),
        imagePath: image ? `data:image/jpeg;base64,${image.base64}` : null,
      };

      const response = await axios.post(`${BASE_URL}/service-products`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', 'Service listed successfully!');
      console.log('Response:', response.data);

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      setCategory('');
      setCustomCategory('');
      setImage(null);
    } catch (error) {
      console.log('Sell Service Error:', error.response || error.message);
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', message);
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
  value={title}
  onChangeText={(value) => {
    // ❌ Prevent leading space
    if (value.startsWith(" ")) return;

    // ❌ Block invalid characters in real-time
    const allowed = /^[A-Za-z0-9 ,\-]*$/;
    if (!allowed.test(value)) {
      setErrors((prev) => ({
        ...prev,
        title: "Only letters, numbers, spaces, comma & hyphen allowed",
      }));
      return;
    }

    // ❌ Remove double spaces
    let formatted = value.replace(/\s\s+/g, " ");

    // ✨ Auto Capitalize Each Word
    formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

    // Update input
    setTitle(formatted);

    // Clear error if valid
    setErrors((prev) => ({ ...prev, title: "" }));
  }}
/>
{errors.title && <Text style={styles.errorText}>{errors.title}</Text>}


      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea, errors.description && styles.errorInput]}
        placeholder="Enter service description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      {/* Price */}
      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={[styles.input, errors.price && styles.errorInput]}
        placeholder="Enter price"
        value={price}
        keyboardType="decimal-pad"
        onChangeText={(value) => {
          const isValid = /^\d*\.?\d{0,2}$/.test(value);
          if (isValid) setPrice(value);
          else setErrors((prev) => ({ ...prev, price: 'Only numbers with up to 2 decimals allowed' }));
        }}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      {/* Delivery Time */}
      <Text style={styles.label}>Delivery Time (Days)</Text>
      <TextInput
        style={[styles.input, errors.deliveryTime && styles.errorInput]}
        placeholder="Enter delivery time in days"
        value={deliveryTime}
        keyboardType="numeric"
        onChangeText={(value) => {
          const numericValue = value.replace(/[^0-9]/g, '');
          setDeliveryTime(numericValue);
        }}
      />
      {errors.deliveryTime && <Text style={styles.errorText}>{errors.deliveryTime}</Text>}

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <View style={[styles.pickerContainer, errors.category && styles.errorInput]}>
        <Picker selectedValue={category} onValueChange={(value) => setCategory(value)}>
          <Picker.Item label="Select Category" value="" />
          {categories.map((cat) => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
      </View>
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

      {/* Custom Category */}
      {category === 'Other' && (
        <>
          <TextInput
            style={[styles.input, errors.customCategory && styles.errorInput]}
            placeholder="Enter custom category"
            value={customCategory}
            onChangeText={setCustomCategory}
          />
          {errors.customCategory && <Text style={styles.errorText}>{errors.customCategory}</Text>}
        </>
      )}

      {/* Image Picker */}
      <Text style={styles.label}>Image (optional)</Text>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick Image'}</Text>
        </TouchableOpacity>
        {image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Submit Service"
          onPress={handleSubmit}
          disabled={!isFormValid}
          color="#1E90FF"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9', flexGrow: 1 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', alignSelf: 'center' },
  label: { fontSize: 16, marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 5, backgroundColor: '#fff' },
  textArea: { height: 100, textAlignVertical: 'top' },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginBottom: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  imagePickerContainer: { marginBottom: 15 },
  imagePicker: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, alignItems: 'center' },
  imagePickerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewContainer: { marginTop: 10, alignItems: 'center' },
  imagePreview: { width: 200, height: 200, borderRadius: 10 },
  removeButton: { marginTop: 5, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'red', borderRadius: 5 },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  buttonContainer: { marginTop: 10, borderRadius: 8, overflow: 'hidden' },
});

export default SellServiceScreen; 