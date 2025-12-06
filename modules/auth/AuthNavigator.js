import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../auth/screens/WelcomeScreen";
import SignupScreen from "../auth/screens/SignupScreen";
import LoginScreen from "../auth/screens/LoginScreen";
import DashboardScreen from "../home/screens/dashboard";
import HomeTabs from "../home/HomeTabs";



const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Home" component={HomeTabs} />
  </Stack.Navigator>
);

export default AuthNavigator;
