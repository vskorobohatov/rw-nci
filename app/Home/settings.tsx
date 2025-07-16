import { ThemedButton } from "@/components/ThemedButton";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { SafeAreaView, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const logoutColor = useThemeColor("error");

  const onPressLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwt");
      router.replace("/SignIn");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <View style={sharedStyles.pageWrapper}>
        <ThemedHeadline>
          <ThemedText type="title">Settings</ThemedText>
        </ThemedHeadline>
        <ThemedButton
          title="Logout"
          color={logoutColor}
          onPress={onPressLogout}
        />
      </View>
    </SafeAreaView>
  );
}
