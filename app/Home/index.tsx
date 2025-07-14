import { ThemedButton } from "@/components/ThemedButton";
import { ThemedHeadline } from "@/components/ThemedHeadline";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import sharedStyles from "@/constants/Styles";
import useNotifications from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Train, TrainsService } from "@/services/trains";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function EventsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const router = useRouter();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { schedulePushNotification } = useNotifications();

  const onPressSchedule = async () => {
    await schedulePushNotification({
      title: "Test Notification",
      body: "This is a test notification.",
      data: { someData: "goes here" },
      seconds: 5,
    }).catch((error) => {
      console.error("Error scheduling notification:", error);
    });
  };

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const trainsRes = await TrainsService.getTrains();
      console.log("Fetched trains:", trainsRes);
      setError(null);
      setTrains(trainsRes.trains || []);
    } catch (error: any) {
      setError(error?.message || "Failed to fetch trains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const onPressLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwt");
      router.replace("/SignIn");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const onPressAddTrain = () => {
    router.push("/AddTrain");
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <View style={sharedStyles.pageWrapper}>
        <ThemedHeadline>
          <ThemedText type="title">Trains</ThemedText>
          <Pressable style={styles.addButton} onPress={onPressAddTrain}>
            <IconSymbol size={28} name="plus" color={textColor} />
          </Pressable>
        </ThemedHeadline>
        {error ? (
          <ThemedText type="error">{error}</ThemedText>
        ) : loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchTrains} />
            }
          >
            <View style={styles.trainsList}>
              {trains.length ? (
                trains.map((train, index) => (
                  <View
                    style={[styles.trainCard, { backgroundColor }]}
                    key={index}
                  >
                    <ThemedText>{`#${train.number}`}</ThemedText>
                    <ThemedText>{train.name}</ThemedText>
                    <ThemedText>{`Arrival: ${train.time_in}`}</ThemedText>
                    <ThemedText>{`Departure: ${train.time_out}`}</ThemedText>
                  </View>
                ))
              ) : (
                <View style={styles.emptyStateWrapper}>
                  <ThemedText type="subtitle">No trains available</ThemedText>
                </View>
              )}
            </View>
          </ScrollView>
        )}
        <ThemedButton title="Logout" onPress={onPressLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  trainsList:{
    flexDirection: "column",
    gap: 8,
  },
  trainCard: {
    padding: 8,
  },
  addButton: {
    width: 40,
    height: 40,
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
