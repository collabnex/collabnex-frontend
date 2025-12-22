import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "./screens/dashboard";
import ArtistListScreen from "./screens/ArtistListScreen";
import ArtistPublicProfileScreen from "./screens/ArtistPublicProfileScreen";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="ArtistList" component={ArtistListScreen} />
      <Stack.Screen
        name="ArtistPublicProfile"
        component={ArtistPublicProfileScreen}
      />
    </Stack.Navigator>
  );
}
