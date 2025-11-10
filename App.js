import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./modules/auth/AuthNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
