import { Slot, Stack } from "expo-router";
import { useAuth } from "../lib/auth";


export default function RootLayout() {
  return( <Slot/> )
  
/*
  const { isAuthenticated, hasTeam } = useAuth();

  if (!isAuthenticated) {
    return (
    );
  }

  if (!hasTeam) {
    return (
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="team_setup"
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal", // or 'transparentModal'
          headerShown: false,
        }}
      />
    </Stack>
  );
  */
}
