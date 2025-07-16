import { Platform, StatusBar, StyleSheet } from "react-native";

const sharedStyles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
  },
  pageWrapper: {
    padding: 16,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    height: "100%",
  },
});

export default sharedStyles;
