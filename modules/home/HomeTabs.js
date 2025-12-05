import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ShowcaseScreen from "./screens/ShowcaseScreen";
import MarketplaceScreen from "./screens/MarketplaceScreen";
import CollaborationScreen from "./screens/CollaborationScreen";
import EventsScreen from "./screens/EventsScreen";

const Tab = createBottomTabNavigator();

function DashboardScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Hello World 👋</Text>
    </View>
  );
}


        
export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // ⭐ ACTIVE / INACTIVE COLOR FOR ICON + TEXT
        tabBarActiveTintColor: "#8000FF",   // purple
        tabBarInactiveTintColor: "grey",

        // ⭐ LABEL BELOW ICON
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
          let iconName;

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
      <Tab.Screen name="Market" component={MarketplaceScreen} />
      <Tab.Screen name="Collab" component={CollaborationScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
}

