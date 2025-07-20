import { ThemedButton } from "@/components/ThemedButton";
import { ThemedDateTimePicker } from "@/components/ThemedDateTimePicker";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedSelect } from "@/components/ThemedSelect";
import { ThemedText } from "@/components/ThemedText";
import { trainScheduleOptions } from "@/constants/Options";
import sharedStyles from "@/constants/Styles";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import Checkbox from "@react-native-community/checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
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

type DayName = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type Schedule = {
  type: string;
  days: Record<DayName, boolean>;
};

const defaultDays = {
  Mon: false,
  Tue: false,
  Wed: false,
  Thu: false,
  Fri: false,
  Sat: false,
  Sun: false,
};

const defaultSchedule = {
  type: trainScheduleOptions[0].value,
  days: defaultDays,
};

const TrainEditorScreen = () => {
  const searchParams = useLocalSearchParams();
  const id = searchParams.id as string;
  const isNew = id === "new";
  const router = useRouter();
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [editMode, setEditMode] = useState(isNew);
  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);

  const textColor = useThemeColor("text");
  const successColor = useThemeColor("success");
  const errorColor = useThemeColor("error");
  const backgroundColor = useThemeColor("background");
  const inputBorderColor = useThemeColor("inputBorder");

  const changeScheduleType = (newVal: string) =>
    setSchedule((prevState) => ({ type: newVal, days: prevState.days }));

  const changeScheduleDay = (newVal: Record<string, any>) => {
    setSchedule((prevState) => ({
      ...prevState,
      days: {
        ...prevState.days,
        ...newVal,
      },
    }));
  };

  const handleCleanForm = () => {
    setTrainName("");
    setTrainNumber("");
    setDepartureTime(new Date());
    setArrivalTime(new Date());
    setSchedule(defaultSchedule);
    setEditMode(isNew);
  };

  const handleSubmit = async () => {
    try {
      const trainData: Train = {
        name: trainName,
        number: trainNumber,
        time_out: moment(departureTime).format("HH:mm"),
        time_in: moment(arrivalTime).format("HH:mm"),
        schedule: JSON.stringify(schedule),
        stops: "",
        comment: "",
      };
      if (!isNew) {
        trainData.id = id;
        await TrainsService.editTrain(trainData);
      } else {
        await TrainsService.addTrain(trainData);
      }
      router.back();
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Failed to add train. Please try again.");
    }
  };

  const handleDeleteTrain = async (trainId: string | number) => {
    try {
      await TrainsService.deleteTrain(trainId);
      router.back();
    } catch (error: any) {
      console.error("Error deleting train:", error);
      Alert.alert("Error", "Failed to delete train. Please try again.");
    }
  };

  const getTrainData = async (trainId: string) => {
    try {
      console.log("Fetching train details for ID:", trainId);
      const response = await TrainsService.getTrainDetails(trainId);
      const trainDetails = response.train as Train;
      console.log("Train details:", trainDetails);
      setTrainName(trainDetails.name);
      setTrainNumber(trainDetails.number);
      setDepartureTime(moment(trainDetails.time_out, "HH:mm").toDate());
      setArrivalTime(moment(trainDetails.time_in, "HH:mm").toDate());
      setSchedule(JSON.parse(trainDetails.schedule) || "everyday");
    } catch (error: any) {
      console.error("Error fetching train details:", error);
      Alert.alert("Error", "Failed to fetch train details. Please try again.");
    }
  };

  useEffect(() => {
    handleCleanForm();
    if (!isNew) {
      getTrainData(id);
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
              {isNew ? "Add Train" : "Details"}
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
          <ThemedInput
            editable={editMode}
            label="Train number"
            placeholder="Train Number"
            value={trainNumber}
            onChangeText={setTrainNumber}
          />
          <ThemedInput
            editable={editMode}
            label="Train name"
            placeholder="Train Name"
            value={trainName}
            onChangeText={setTrainName}
          />
          <ThemedDateTimePicker
            buttonText={moment(departureTime).format("HH:mm")}
            disabled={!editMode}
            label="Departure time"
            value={departureTime}
            onChange={(newVal) => setDepartureTime(newVal)}
          />
          <ThemedDateTimePicker
            buttonText={moment(arrivalTime).format("HH:mm")}
            disabled={!editMode}
            label="Arrival time"
            value={arrivalTime}
            onChange={(newVal) => setArrivalTime(newVal)}
          />
          <ThemedSelect
            disabled={!editMode}
            value={schedule.type}
            label="Schedule type"
            options={trainScheduleOptions}
            onSelect={(selectedItem: any) => {
              changeScheduleType(selectedItem.value);
            }}
          />
          {schedule.type === "custom" ? (
            <View style={styles.customScheduleWrapper}>
              <ThemedText>Schedule</ThemedText>
              <View
                style={[
                  styles.daysWrapper,
                  {
                    backgroundColor,
                    borderColor: inputBorderColor,
                    borderWidth: 1,
                  },
                ]}
              >
                {Object.keys(schedule.days).map((key: string) => {
                  const dayKey = key as DayName;
                  return (
                    <View key={dayKey} style={styles.dayItem}>
                      <ThemedText>{dayKey}</ThemedText>
                      <Checkbox
                        disabled={!editMode}
                        value={schedule.days[dayKey]}
                        onValueChange={(newVal) =>
                          changeScheduleDay({ [dayKey]: newVal })
                        }
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
          {!isNew ? (
            <ThemedButton
              title="Delete train"
              color={errorColor}
              onPress={() => handleDeleteTrain(id)}
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

export default TrainEditorScreen;
