import { ThemedButton } from "@/components/ThemedButton";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { actionOptions } from "@/constants/Options";
import sharedStyles from "@/constants/Styles";
import {
  cleanAllEvents,
  editEvent,
  Event,
  getEvents,
  getEventTime,
  getSecondsUntilEvent,
} from "@/helpers/eventsHelper";
import useNotifications from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";

import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const CardItem = ({
  label,
  value,
}: {
  label: string | number;
  value: string | number;
}) => {
  return (
    <View style={styles.cardItem}>
      <ThemedText type="default" style={{ fontSize: 12 }}>
        {label}
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={{ textAlign: "left" }}>
        {value}
      </ThemedText>
    </View>
  );
};

export default function EventsScreen() {
  const router = useRouter();
  const { schedulePushNotification, cancelPushNotification } =
    useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const textColor = useThemeColor("text");
  const backgroundColor = useThemeColor("background");
  const dividerColor = useThemeColor("divider");
  const borderColor = useThemeColor("inputBorder");

  const fetchEvents = async () => {
    const savedEvents = await getEvents();
    setEvents(savedEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onPressSchedule = async (event: Event) => {
    const title = `${
      actionOptions.find((it) => it.value === event.action)?.label ||
      event.action
    } ${event.type} at ${getEventTime(event)}`;
    const body = `${event.train.number} ${event.train.name}. ${event.comment}`;
    const notificationId = await schedulePushNotification({
      title,
      body,
      seconds: getSecondsUntilEvent(event.date, getEventTime(event)),
    }).catch((error: any) => {
      console.error("Error scheduling notification:", error);
    });
    editEvent({ ...event, notificationId });
  };

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
                  <View style={styles.valuesRow}>
                    <ThemedText type="defaultSemiBold" style={styles.rowItem}>
                      {moment(event.date).format("DD.MM.YYYY")}
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.rowItem, { textAlign: "center" }]}
                    >
                      {event.action}
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.rowItem, { textAlign: "right" }]}
                    >
                      {getEventTime(event)}
                    </ThemedText>
                  </View>
                  <CardItem
                    label="Train"
                    value={`${event.train.number} ${event.train.name}`}
                  />
                  {event.comment ? (
                    <CardItem label="Comment" value={event.comment} />
                  ) : null}
                  {event.documentId || event.fullName ? (
                    <View
                      style={[
                        styles.personWrapper,
                        { borderTopColor: dividerColor },
                      ]}
                    >
                      <ThemedText>Person information</ThemedText>
                      <View style={styles.personDetailsRow}>
                        {event.fullName ? (
                          <CardItem label="Full name" value={event.fullName} />
                        ) : null}
                        {event.documentId ? (
                          <CardItem
                            label="Document #"
                            value={event.documentId}
                          />
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                  <Pressable
                    style={[styles.subscribeBtn, { borderColor }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      onPressSchedule(event);
                    }}
                  >
                    <ThemedText>Subscribe</ThemedText>
                  </Pressable>
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
