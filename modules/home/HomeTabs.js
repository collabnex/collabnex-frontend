import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeStackNavigator from "./HomeStackNavigator";
import ShowcaseScreen from "./screens/ShowcaseScreen";
import MarketNavigator from "../marketplace/MarketNavigator";
import EventsNavigator from "../events/EventsNavigator";
import ProfileNavigator from "../profile/ProfileNavigator";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#8000FF",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 6,
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
            case "Events":
              iconName = "calendar-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      {/* ✅ STACK inside TAB */}
      <Tab.Screen name="Dashboard" component={HomeStackNavigator} />
      <Tab.Screen name="Showcase" component={ShowcaseScreen} />
      <Tab.Screen name="Market" component={MarketNavigator} />
      <Tab.Screen name="Events" component={EventsNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}
