import { Slot, Stack } from "expo-router";
import { useAuth } from "../lib/auth";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This wraps your tab layout */}
      <Stack.Screen options={{ headerShown: false }} name="(tabs)/home" />

      {/* This makes /modal show as a modal */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Edit Profile",
        }}
      />
    </Stack>
  );
}
