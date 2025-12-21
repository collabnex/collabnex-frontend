import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../auth/screens/WelcomeScreen";
import SignupScreen from "../auth/screens/SignupScreen";
import LoginScreen from "../auth/screens/LoginScreen";
import CreateProfile from "../auth/screens/CreateProfile";

import DashboardScreen from "../home/screens/dashboard";
import HomeTabs from "../home/HomeTabs";

import BuyNow from "../marketplace/screens/BuyNow";
import SettingsScreen from "../home/screens/SettingsScreen";
import ShowcaseScreen from "../home/screens/ShowcaseScreen";
import MyEvents from "../events/screens/MyEvents";
import AddEvents from "../events/screens/addEvents";
import EventDetails from "../events/screens/Eventdetails";
import ArtistListScreen from "../home/screens/ArtistListScreen";
import ArtistPublicProfile from "../home/screens/ArtistPublicProfileScreen";
const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="CreateProfile" component={CreateProfile} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Home" component={HomeTabs} />
    <Stack.Screen name="Showcase" component={ShowcaseScreen} />
    <Stack.Screen name="AddEvents" component={AddEvents} />
    <Stack.Screen name="MyEvents" component={MyEvents} />
    <Stack.Screen name="BuyNow" component={BuyNow} />
    <Stack.Screen name="EventDetails" component={EventDetails} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ArtistPublicProfile" component={ArtistPublicProfile} />
    <Stack.Screen
      name="ArtistList"
      component={ArtistListScreen}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
