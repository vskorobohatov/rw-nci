import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ScheduleScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">Explore</ThemedText>
      <ThemedText>
        This is a schedule screen for the Events Tracker app. Here you can find
        various events and activities happening around you, organized by date
        and time.
      </ThemedText>
    </ThemedView>
  );
}
