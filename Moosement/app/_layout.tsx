import { Slot, Stack } from "expo-router";
import { useAuth } from "../lib/auth";



  export default function RootLayout() {
    return (
      <Stack>
        {/* This wraps your tab layout */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* This makes /modal show as a modal */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Edit Profile' }}
        />
      </Stack>
    );
  }
  
