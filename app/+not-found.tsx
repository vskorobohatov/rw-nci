import { Link, Stack } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function NotFoundScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error reading token", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView style={sharedStyles.safeArea}>
        <ScrollView>
          <View style={[sharedStyles.pageWrapper, styles.container]}>
            <ThemedText type="title">This screen does not exist.</ThemedText>
            <Link href={isLoggedIn ? "/Home" : "/SignIn"} style={styles.link}>
              <ThemedText type="link">Go to home screen!</ThemedText>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
