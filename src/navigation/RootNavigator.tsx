import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import CoverScreen from "../screens/CoverScreen";
import TabsNavigator from "./TabsNavigator";
import FakeCallScreen from "../screens/FakeCallScreen";



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cover" component={CoverScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen
        name="Call"
        component={FakeCallScreen}
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack.Navigator>
  );
}
