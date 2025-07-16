import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { getToken, removeToken } from "@/helpers/tokenHelper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const checkLogin = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/SignIn");
        return;
      }
      router.replace("/Home");
    } catch (error) {
      await removeToken();
      router.replace("/SignIn");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" />
        <Stack.Screen name="AddTrain" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="SignIn" />
        <Stack.Screen name="SignUp" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
