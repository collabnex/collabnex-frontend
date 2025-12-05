import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Your existing screens
import ShowcaseScreen from "./screens/ShowcaseScreen";
import MarketplaceScreen from "./screens/MarketplaceScreen";
import CollaborationScreen from "./screens/CollaborationScreen";
import EventsScreen from "./screens/EventsScreen";

const Tab = createBottomTabNavigator();

// Simple Hello World component inside your Dashboard tab
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
                tabBarActiveTintColor: "#007bff",
                tabBarInactiveTintColor: "gray",
                tabBarIcon: ({ focused, size, color }) => {
                    let iconName;

                    if (route.name === "Dashboard") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Showcase") {
                        iconName = focused ? "images" : "images-outline";
                    } else if (route.name === "Market") {
                        iconName = focused ? "cart" : "cart-outline";
                    } else if (route.name === "Collab") {
                        iconName = focused ? "people" : "people-outline";
                    } else if (route.name === "Events") {
                        iconName = focused ? "calendar" : "calendar-outline";
                    }

                    return <Ionicons name={iconName} size={20} color={color} />;
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
