import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";

const AddTrain = () => {
  const router = useRouter();
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const errorColor = useThemeColor("error");

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
          <ThemedText type="title">Add Train</ThemedText>
          <ThemedInput
            label="Train number"
            placeholder="Train Number"
            value={trainNumber}
            onChangeText={setTrainNumber}
          />
          <ThemedInput
            label="Train name"
            placeholder="Train Name"
            value={trainName}
            onChangeText={setTrainName}
          />
          <ThemedInput
            label="Departure time"
            value={departureTime}
            onChangeText={setDepartureTime}
            placeholder="HH:MM"
          />
          <ThemedInput
            label="Arrival time"
            value={arrivalTime}
            onChangeText={setArrivalTime}
            placeholder="HH:MM"
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ThemedButton
              title="Cancel"
              color={errorColor}
              onPress={() => {
                router.back();
              }}
            />
            <ThemedButton title="Save" onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTrain;
