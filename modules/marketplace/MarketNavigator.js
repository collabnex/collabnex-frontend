import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MarketplaceScreen from "../home/screens/MarketplaceScreen";
import SellProduct from "./screens/sellProduct";
import SellServices from "./screens/sellServices";
import MyOrders from "./screens/myOrdersScreen";
import BuyNowScreen from "./screens/buyNowScreen";

const Stack = createNativeStackNavigator();

export default function MarketNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MarketplaceHome"
    >
      <Stack.Screen name="MarketplaceHome" component={MarketplaceScreen} />
      <Stack.Screen name="SellProduct" component={SellProduct} />
      <Stack.Screen name="SellServices" component={SellServices} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="BuyNowScreen" component={BuyNowScreen} />
    </Stack.Navigator>
  );
}
