import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { Train, TrainsService } from "@/services/trains";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const TrainEditorScreen = () => {
  const { id } = useLocalSearchParams();
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [scheduleType, setScheduleType] = useState("everyday");

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
      await TrainsService.addTrain(trainData);
      router.back();
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", "Failed to add train. Please try again.");
    }
  };

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
              {id !== "add" ? "Details" : "Add Train"}
            </ThemedText>
            <View style={[styles.headlinePart, styles.rightPart]}>
              <Pressable
                onPress={() =>
                  editMode ? handleSubmit() : setEditMode(!editMode)
                }
              >
                <ThemedText style={styles.buttonText}>
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
