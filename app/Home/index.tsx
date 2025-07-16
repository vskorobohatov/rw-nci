import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import sharedStyles from "@/constants/Styles";
import useNotifications from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";

import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";

export default function EventsScreen() {
  const textColor = useThemeColor("text");
  const router = useRouter();
  const { schedulePushNotification } = useNotifications();

  const onPressSchedule = async () => {
    await schedulePushNotification({
      title: "Test Notification",
      body: "This is a test notification.",
      data: { someData: "goes here" },
      seconds: 5,
    }).catch((error: any) => {
      console.error("Error scheduling notification:", error);
    });
  };

  const onPressAddEvent = () => {
    router.push("/AddEvent");
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <View style={sharedStyles.pageWrapper}>
        <ThemedHeadline>
          <ThemedText type="title">Events</ThemedText>
          <Pressable style={styles.addButton} onPress={onPressAddEvent}>
            <IconSymbol size={24} name="plus" color={textColor} />
          </Pressable>
        </ThemedHeadline>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
  },
});
