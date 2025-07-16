import { ThemedButton } from "@/components/ThemedButton";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const TrainEditorScreen = () => {
  const searchParams = useLocalSearchParams();
  const id = searchParams.id as string;
  const isNew = id === "add";
  const router = useRouter();
  const [departureTime, setDepartureTime] = useState("");
  const [editMode, setEditMode] = useState(isNew);
  const [arrivalTime, setArrivalTime] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [scheduleType, setScheduleType] = useState("everyday");

  const textColor = useThemeColor("text");
  const successColor = useThemeColor("success");
  const errorColor = useThemeColor("error");

  const handleCleanForm = () => {
    setTrainName("");
    setTrainNumber("");
    setDepartureTime("");
    setArrivalTime("");
    setScheduleType("everyday");
  };

  const handleSubmit = async () => {
    try {
      const trainData: Train = {
        name: trainName,
        number: trainNumber,
        time_out: departureTime,
        time_in: arrivalTime,
        schedule: "",
        stops: "",
        comment: "",
      };
      if (id !== "add") {
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

  const handleDeleteTrain = async () => {
    try {
      await TrainsService.deleteTrain(id);
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
      setDepartureTime(trainDetails.time_out);
      setArrivalTime(trainDetails.time_in);
      setScheduleType(trainDetails.schedule || "everyday");
    } catch (error: any) {
      console.error("Error fetching train details:", error);
      Alert.alert("Error", "Failed to fetch train details. Please try again.");
    }
  };

  useEffect(() => {
    handleCleanForm();
    setEditMode(isNew);
    if (id !== "add") {
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
          <ThemedInput
            editable={editMode}
            label="Departure time"
            value={departureTime}
            onChangeText={setDepartureTime}
            placeholder="HH:MM"
          />
          <ThemedInput
            editable={editMode}
            label="Arrival time"
            value={arrivalTime}
            onChangeText={setArrivalTime}
            placeholder="HH:MM"
          />
          {!isNew ? (
            <ThemedButton
              title="Delete train"
              color={errorColor}
              onPress={() => handleDeleteTrain()}
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
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 24,
  },
  rightPart: {
    justifyContent: "flex-end",
  },
  title: {
    flex: 2,
    textAlign: "center",
  },
});

export default TrainEditorScreen;
