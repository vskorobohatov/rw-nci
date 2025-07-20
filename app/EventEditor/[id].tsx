import { ThemedButton } from "@/components/ThemedButton";
import { ThemedDateTimePicker } from "@/components/ThemedDateTimePicker";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedSelect } from "@/components/ThemedSelect";
import { ThemedText } from "@/components/ThemedText";
import { actionOptions, eventTypeOptions } from "@/constants/Options";
import sharedStyles from "@/constants/Styles";
import {
  addEvent,
  deleteEvent,
  Event,
  getEventDetails,
} from "@/helpers/eventsHelper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sortBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import uuid from "react-native-uuid";

const EventEditorScreen = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const id = searchParams.id as string;
  const isNew = id === "new";
  const [trains, setTrains] = useState<Train[]>([]);
  const [editMode, setEditMode] = useState(isNew);
  const [eventData, setEventData] = useState<Event>({
    id: isNew ? uuid.v4() : id,
    type: eventTypeOptions[0].value,
    action: actionOptions[0].value,
    train: {
      id: "",
      number: "",
      name: "",
      time_in: "",
      time_out: "",
      schedule: "",
      stops: "",
      comment: "",
    },
    date: new Date(),
    fullName: "",
    documentId: "",
    comment: "",
  });

  const textColor = useThemeColor("text");
  const successColor = useThemeColor("success");
  const errorColor = useThemeColor("error");

  const handleCleanForm = () => {
    setEditMode(isNew);
  };

  const handleSubmit = async () => {
    try {
      await addEvent(eventData);
      router.back();
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Failed to add train. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(id);
      router.back();
    } catch (error: any) {
      console.error("Error deleting train:", error);
      Alert.alert("Error", "Failed to delete train. Please try again.");
    }
  };

  const fetchTrains = async (isRefresh = false) => {
    try {
      const trainsRes = await TrainsService.getTrains(isRefresh);
      setTrains(trainsRes.trains || []);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to fetch trains");
    }
  };

  const getEventData = async () => {
    try {
      const data = await getEventDetails(id);
      setEventData({ ...data, date: moment(data.date).toDate() });
    } catch (error: any) {
      console.error("Error fetching event details:", error);
      Alert.alert("Error", "Failed to fetch event details. Please try again.");
    }
  };

  useEffect(() => {
    handleCleanForm();
    fetchTrains();
    if (!isNew) {
      getEventData();
    }
  }, [id]);

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView>
        <View style={sharedStyles.pageWrapper}>
          <ThemedHeadline>
            <View style={styles.headlinePart}>
              <Pressable onPress={() => router.back()}>
                <ThemedText style={styles.buttonText}>Back</ThemedText>
              </Pressable>
            </View>
            <ThemedText type="title">
              {isNew ? "Add Event" : "Details"}
            </ThemedText>
            <View style={[styles.headlinePart, styles.rightPart]}>
              <Pressable
                onPress={() =>
                  editMode ? handleSubmit() : setEditMode(!editMode)
                }
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { color: editMode ? successColor : textColor },
                  ]}
                >
                  {editMode ? "Save" : "Edit"}
                </ThemedText>
              </Pressable>
            </View>
          </ThemedHeadline>

          <ThemedSelect
            disabled={!editMode}
            value={eventData.type}
            label="Event type"
            options={eventTypeOptions}
            onSelect={(selectedItem: any) => {
              setEventData({ ...eventData, type: selectedItem.value });
            }}
          />

          <ThemedSelect
            disabled={!editMode}
            value={eventData.action}
            label="Action"
            options={actionOptions}
            onSelect={(selectedItem: any) => {
              setEventData({ ...eventData, action: selectedItem.value });
            }}
          />

          <ThemedDateTimePicker
            mode="date"
            buttonText={moment(eventData.date).format("DD.MM.YYYY")}
            disabled={!editMode}
            label="Date"
            value={eventData.date}
            onChange={(newVal: Date) =>
              setEventData((prevState) => ({ ...prevState, date: newVal }))
            }
          />

          <ThemedSelect
            disabled={!editMode}
            value={eventData.train.id}
            label="Train"
            options={sortBy(trains, "number").map((it) => ({
              label: `${it.number} ${it.name}`,
              value: it.id as string,
            }))}
            onSelect={(selectedItem: any) => {
              setEventData({
                ...eventData,
                train: trains.find(
                  (it) => it.id === selectedItem.value
                ) as Train,
              });
            }}
          />

          {eventData.type === "invalid" ? (
            <>
              <ThemedInput
                editable={editMode}
                label="Passenger name"
                value={eventData.fullName}
                onChangeText={(newVal) => {
                  setEventData({ ...eventData, fullName: newVal });
                }}
              />
              <ThemedInput
                editable={editMode}
                label="Document #"
                value={eventData.documentId}
                onChangeText={(newVal) => {
                  setEventData({ ...eventData, documentId: newVal });
                }}
              />
            </>
          ) : null}

          <ThemedInput
            multiline
            style={{ height: 80 }}
            editable={editMode}
            label="Comment"
            value={eventData.comment}
            onChangeText={(newVal) => {
              setEventData({ ...eventData, comment: newVal });
            }}
          />

          {!isNew ? (
            <ThemedButton
              title="Delete Event"
              color={errorColor}
              onPress={() => handleDeleteEvent()}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headlinePart: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 24,
  },
  rightPart: {
    justifyContent: "flex-end",
  },
  title: {
    flex: 2,
    textAlign: "center",
  },
  customScheduleWrapper: {
    display: "flex",
    gap: 4,
  },
  daysWrapper: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },
  dayItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
});

export default EventEditorScreen;
