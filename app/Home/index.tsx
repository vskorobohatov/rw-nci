import EventCard from "@/components/EventCard";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import sharedStyles from "@/constants/Styles";
import {
  cleanAllEvents,
  Event,
  getEvents,
  getEventTime,
  getSecondsUntilEvent,
} from "@/helpers/eventsHelper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useIsFocused } from "@react-navigation/native";
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
  const isFocused = useIsFocused();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const textColor = useThemeColor("text");

  const fetchEvents = async () => {
    const savedEvents = await getEvents();
    setEvents(savedEvents);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [isFocused]);

  const onPressAddEvent = () => {
    router.push("/EventEditor/new");
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

        <ThemedButton title="Clean events" onPress={cleanAllEvents} />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchEvents();
              }}
            />
          }
        >
          <View style={styles.trainsList}>
            {events.length ? (
              events
                .filter(
                  (event: Event) =>
                    getSecondsUntilEvent(event.date, getEventTime(event)) > 0
                )
                .map((event: Event, index) => (
                  <EventCard key={event.id || index} event={event} />
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
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
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
  valuesRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowItem: {
    textTransform: "capitalize",
    width: 90,
    fontSize: 16,
  },
  personWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 4,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  personDetailsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  cardItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 4,
  },
  subscribeBtn: {
    height: 40,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
