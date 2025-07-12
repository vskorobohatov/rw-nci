import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useNotifications from "@/hooks/useNotifications";
import { Train, TrainsService } from "@/services/trains";

import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function EventsScreen() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { schedulePushNotification } = useNotifications();

  const onPressSchedule = async () => {
    console.log("Schedule button pressed");
    await schedulePushNotification({
      title: "Test Notification",
      body: "This is a test notification.",
      data: { someData: "goes here" },
      seconds: 5,
    }).catch((error) => {
      console.error("Error scheduling notification:", error);
    });
  };

  const fetchTrains = async () => {
    try {
      const trainsRes = await TrainsService.getTrains();
      setTrains(trainsRes);
    } catch (error: any) {
      setError(error?.message || "Failed to fetch trains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  return (
    <ThemedView>
      <ThemedText type="title">Trains</ThemedText>
      {error ? (
        <ThemedText type="error">{error}</ThemedText>
      ) : loading ? (
        <ActivityIndicator size="large" />
      ) : (
        trains.map((train, index) => (
          <ThemedText key={index}>
            {train.name} - {train.time}
          </ThemedText>
        ))
      )}
      <ThemedButton title="Schedule event" onPress={onPressSchedule} />
    </ThemedView>
  );
}
