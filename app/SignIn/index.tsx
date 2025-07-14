import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { AuthService } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign In",
    });
  }, [navigation]);

  const handleSignIn = async () => {
    if (email && password) {
      try {
        const res = await AuthService.login(email, password);
        await AsyncStorage.setItem("jwt", res.jwt);
        router.replace("/Home");
      } catch (error) {
        console.error("Sign in error:", error);
      }
    } else {
      Alert.alert("Error", "Please enter email and password.");
    }
  };

  const handleSignUp = () => {
    router.replace("/SignUp");
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView>
        <View style={sharedStyles.pageWrapper}>
          <ThemedInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <ThemedInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <ThemedButton title="Sign In" onPress={handleSignIn} />
          <TouchableOpacity onPress={handleSignUp} style={styles.linkContainer}>
            <ThemedText type="link">
              Don&apos;t have an account? Sign Up
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});

export default SignIn;
