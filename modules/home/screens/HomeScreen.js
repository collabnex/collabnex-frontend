import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import colors from '../../global/theme/colors';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    Alert.alert('Logged out', 'See you soon!');
    navigation.replace('Auth'); // back to Welcome flow
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Welcome to CollabNex!</Text>
      <Text style={styles.subtitle}>You’re logged in successfully.</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background, padding: 20,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.secondary },
  subtitle: { fontSize: 16, color: colors.textGray, marginTop: 10 },
  button: {
    backgroundColor: colors.primary, marginTop: 40,
    paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
