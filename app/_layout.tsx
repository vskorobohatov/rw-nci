import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setIsLoggedIn(!!token);
      router.replace("/Home");
    } catch (error) {
      console.error("Ошибка чтения токена", error);
      setIsLoggedIn(false);
    } finally {
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
        {isLoggedIn ? (
          <>
            <Stack.Screen name="tabs" />
            <Stack.Screen name="AddTrain" />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" />
            <Stack.Screen name="SignUp" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
