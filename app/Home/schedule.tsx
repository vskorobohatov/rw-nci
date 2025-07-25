import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import sharedStyles from "@/constants/Styles";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function ScheduleScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trains, setTrains] = useState<Train[]>([]);
  const [error, setError] = useState<string | null>(null);

  const textColor = useThemeColor("text");
  const backgroundColor = useThemeColor("background");

  const fetchTrains = async () => {
    try {
      const trainsRes = await TrainsService.getTrains();
      setError(null);
      setTrains(trainsRes.trains || []);
    } catch (error: any) {
      setError(error?.message || "Failed to fetch trains");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTrains();
  }, [isFocused]);

  const onPressAddTrain = () => {
    router.push("/TrainEditor/new");
  };

  const handleDeleteTrain = async (trainId: string | number) => {
    try {
      await TrainsService.deleteTrain(trainId);
    } catch (error: any) {
      console.error("Error deleting train:", error);
    }
  };

  const deleteAllTrains = () => {
    trains.forEach((train: any) => {
      handleDeleteTrain(train.id);
    });
    fetchTrains();
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <View style={sharedStyles.pageWrapper}>
        <ThemedHeadline>
          <ThemedText type="title">Schedule</ThemedText>
          <Pressable style={styles.addButton} onPress={onPressAddTrain}>
            <IconSymbol size={22} name="plus" color={textColor} />
          </Pressable>
        </ThemedHeadline>
        <Button title="Delete all trains" onPress={deleteAllTrains} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTrains();
              }}
            />
          }
        >
          {error ? (
            <ThemedText type="error">{error}</ThemedText>
          ) : loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <View style={styles.trainsList}>
              {trains.length ? (
                trains.map((train, index) => (
                  <Pressable
                    onPress={() => router.push(`/TrainEditor/${train.id}`)}
                    style={[styles.trainCard, { backgroundColor }]}
                    key={train.id || index}
                  >
                    <ThemedText>{`#${train.number}`}</ThemedText>
                    <ThemedText>{train.name}</ThemedText>
                    <ThemedText>{`Departure: ${moment(
                      train.time_out,
                      "HH:mm"
                    ).format("HH:mm")}`}</ThemedText>
                    <ThemedText>{`Arrival: ${moment(
                      train.time_in,
                      "HH:mm"
                    ).format("HH:mm")}`}</ThemedText>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyStateWrapper}>
                  <ThemedText type="subtitle">No trains available</ThemedText>
                </View>
              )}
            </View>
          )}
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
});
