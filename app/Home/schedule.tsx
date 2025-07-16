import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import sharedStyles from "@/constants/Styles";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import { useRouter } from "expo-router";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function ScheduleScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const router = useRouter();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrains = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const trainsRes = await TrainsService.getTrains(isRefresh);
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
    fetchTrains();
  }, []);

  const onPressAddTrain = () => {
    router.push("/TrainEditor/add");
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchTrains(true)}
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
                    <ThemedText>{`Arrival: ${train.time_in}`}</ThemedText>
                    <ThemedText>{`Departure: ${train.time_out}`}</ThemedText>
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
