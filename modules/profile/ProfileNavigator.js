import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// existing screens (DO NOT MOVE THEM)
import ArtistPublicProfileScreen from "../home/screens/ArtistPublicProfileScreen";
import SettingsScreen from "../home/screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileHome"
        component={ArtistPublicProfileScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      
    </Stack.Navigator>
  );
}

