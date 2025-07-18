import { StyleSheet, View } from "react-native";

export function ThemedHeadline({ style, ...rest }: any) {
  return <View style={[styles.header, style]} {...rest}/>;
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
