import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";

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
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Showcase" component={ShowcaseScreen} />
            <Tab.Screen name="Market" component={MarketplaceScreen} />
            <Tab.Screen name="Collab" component={CollaborationScreen} />
            <Tab.Screen name="Events" component={EventsScreen} />
        </Tab.Navigator>
    );
}
