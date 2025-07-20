import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import sharedStyles from "@/constants/Styles";
import { Event, getEvents } from "@/helpers/eventsHelper";
import useNotifications from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function EventsScreen() {
  const router = useRouter();
  const { schedulePushNotification } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const textColor = useThemeColor("text");
  const backgroundColor = useThemeColor("background");

  const fetchEvents = async () => {
    const savedEvents = await getEvents();
    setEvents(savedEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
    router.push("/EventEditor/new");
  };

  const getEventTime = (event: Event) => {
    return "Time";
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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchEvents()}
            />
          }
        >
          <View style={styles.trainsList}>
            {events.length ? (
              events.map((event: Event, index) => (
                <Pressable
                  onPress={() => router.push(`/EventEditor/${event.id}`)}
                  style={[styles.trainCard, { backgroundColor }]}
                  key={event.id || index}
                >
                  <ThemedText style={styles.values}>
                    Type: {event.type}
                  </ThemedText>
                  <ThemedText style={styles.values}>
                    Action: {event.action}
                  </ThemedText>
                  <ThemedText style={styles.values}>
                    Time: {getEventTime(event)}
                  </ThemedText>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyStateWrapper}>
                <ThemedText type="subtitle">No events</ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  trainsList: {
    flexDirection: "column",
    gap: 8,
    height: "100%",
    flex: 1,
    paddingBottom: 48,
  },
  trainCard: {
    padding: 8,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
  },
  emptyStateWrapper: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  values: {
    textTransform: "capitalize",
  },
});
