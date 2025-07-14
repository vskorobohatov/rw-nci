import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

export type CustomPageViewProps = ViewProps & {
  scrollViewProps?: any;
};

export function CustomPageView({
  style,
  scrollViewProps,
  ...otherProps
}: CustomPageViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView {...scrollViewProps}>
        <View
          style={[
            {
              padding: 16,
              flexDirection: "column",
              alignItems: "stretch",
              gap: 8,
            },
            style,
          ]}
          {...otherProps}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
    gap: "16px",
  },
});
