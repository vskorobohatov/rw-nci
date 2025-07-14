import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import sharedStyles from "@/constants/Styles";
import { AuthService } from "@/services/auth";
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

const SignUp = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign Up",
    });
  }, [navigation]);

  const handleSignUp = async () => {
    if (name && email && password) {
      try {
        await AuthService.register(name, email, password);
        Alert.alert("Signed Up", `Welcome, ${name}!`);
      } catch (error) {
        Alert.alert("Error", "Sign up failed. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter name, email, and password.");
    }
  };

  const handleGoToSignIn = () => {
    router.replace("/SignIn");
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView>
        <View style={sharedStyles.pageWrapper}>
          <ThemedInput placeholder="Name" value={name} onChangeText={setName} />
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
          <ThemedButton title="Sign Up" onPress={handleSignUp} />
          <TouchableOpacity
            onPress={handleGoToSignIn}
            style={styles.linkContainer}
          >
            <ThemedText type="link">
              Already have an account? Sign In
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

export default SignUp;
