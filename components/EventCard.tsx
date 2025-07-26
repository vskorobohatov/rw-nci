import { ThemedText } from "@/components/ThemedText";
import { actionOptions } from "@/constants/Options";
import { editEvent, Event, getEventTime, getSecondsUntilEvent } from "@/helpers/eventsHelper";
import useNotifications from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";

import { Pressable, StyleSheet, View } from "react-native";

const notificationOffset = 900; // 15 minutes

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

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const { schedulePushNotification, cancelPushNotification } =
    useNotifications();
  const backgroundColor = useThemeColor("background");
  const dividerColor = useThemeColor("divider");
  const borderColor = useThemeColor("inputBorder");
  const [eventData, setEventData] = useState(event || {});

  useEffect(() => {
    setEventData(event);
  }, [event]);

  const onPressSchedule = async () => {
    const title = `${
      actionOptions.find((it) => it.value === eventData.action)?.label ||
      eventData.action
    } ${eventData.type} at ${getEventTime(eventData)}`;
    const body = `${eventData.train.number} ${eventData.train.name}. ${eventData.comment}`;
    const notificationId = await schedulePushNotification({
      title,
      body,
      seconds: getSecondsUntilEvent(eventData.date, getEventTime(event)) - notificationOffset,
    }).catch((error: any) => {
      console.error("Error scheduling notification:", error);
    });
    editEvent({ ...eventData, notificationId });
    setEventData({ ...eventData, notificationId });
  };

  const onPressCancel = () => {
    cancelPushNotification(eventData.notificationId);
    editEvent({ ...eventData, notificationId: undefined });
    setEventData({ ...eventData, notificationId: undefined });
  };

  return (
    <Pressable
      onPress={() => router.push(`/EventEditor/${eventData.id}`)}
      style={[styles.trainCard, { backgroundColor }]}
    >
      <View style={styles.valuesRow}>
        <ThemedText type="defaultSemiBold" style={styles.rowItem}>
          {moment(eventData.date).format("DD.MM.YYYY")}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.rowItem, { textAlign: "center" }]}
        >
          {eventData.action}
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
        value={`${eventData.train.number} ${eventData.train.name}`}
      />
      {eventData.comment ? (
        <CardItem label="Comment" value={eventData.comment} />
      ) : null}
      {eventData.documentId || eventData.fullName ? (
        <View style={[styles.personWrapper, { borderTopColor: dividerColor }]}>
          <ThemedText>Person information</ThemedText>
          <View style={styles.personDetailsRow}>
            {eventData.fullName ? (
              <CardItem label="Full name" value={eventData.fullName} />
            ) : null}
            {eventData.documentId ? (
              <CardItem label="Document #" value={eventData.documentId} />
            ) : null}
          </View>
        </View>
      ) : null}
      <Pressable
        style={[styles.subscribeBtn, { borderColor }]}
        onPress={(e) => {
          e.stopPropagation();
          if (eventData.notificationId) {
            onPressCancel();
          } else {
            onPressSchedule();
          }
        }}
      >
        <ThemedText>
          {eventData.notificationId ? "Unsubscribe" : "Subscribe"}
        </ThemedText>
      </Pressable>
    </Pressable>
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
