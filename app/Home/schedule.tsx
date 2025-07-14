import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { SafeAreaView, ScrollView, View } from "react-native";

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView>
        <View style={sharedStyles.pageWrapper}>
          <ThemedText type="title">Explore</ThemedText>
          <ThemedText>
            This is a schedule screen for the Events Tracker app. Here you can
            find various events and activities happening around you, organized
            by date and time.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
