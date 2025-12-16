import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ShowcaseScreen from "./screens/ShowcaseScreen";
import MarketplaceScreen from "./screens/MarketplaceScreen";
import CollaborationScreen from "./screens/CollaborationScreen";
import EventsScreen from "./screens/EventsScreen";
import DashboardScreen from "./screens/dashboard";
import MarketNavigator from "../marketplace/MarketNavigator";
import { API_BASE_URL } from "../global/services/env";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#8000FF",
        tabBarInactiveTintColor: "grey",

        tabBarLabelPosition: "below-icon",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 6,
        },

        tabBarIconStyle: {
          marginTop: 6,
        },

        tabBarStyle: {
          height: 70,
          paddingBottom: 6,
        },

        tabBarIcon: ({ color }) => {
          let iconName = "ellipse";

          switch (route.name) {
            case "Dashboard":
              iconName = "grid-outline";
              break;
            case "Showcase":
              iconName = "color-palette-outline";
              break;
            case "Market":
              iconName = "cart-outline";
              break;
            case "Collab":
              iconName = "people-outline";
              break;
            case "Events":
              iconName = "calendar-outline";
              break;
            default:
              iconName = "chevron-down";
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Showcase" component={ShowcaseScreen} />
      <Tab.Screen name="Market" component={MarketNavigator} />
      <Tab.Screen name="Collab" component={CollaborationScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
}




/*                                   STYLES                                    */


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F3FF",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4A237A",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B6B6B",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
    color: "#4A237A",
  },

  input: {
    backgroundColor: "#F8F5FF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C7B5FF",
    padding: 14,
    fontSize: 15,
    color: "#3A3A3A",
  },
});





