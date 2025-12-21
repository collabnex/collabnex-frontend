import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EventsScreen from "../home/screens/EventsScreen";
import AddEvents from "./screens/addEvents";
import MyEvents from "./screens/MyEvents";
import EventDetails from "./screens/Eventdetails";
import MyEventDetails from "./screens/MyEventsdetails";

const Stack = createNativeStackNavigator();

export default function EventsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsScreen" component={EventsScreen} />
      <Stack.Screen name="AddEvents" component={AddEvents} />
      <Stack.Screen name="MyEvents" component={MyEvents} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="MyEventdetails" component={MyEventDetails}/>
    </Stack.Navigator>
  );
}
