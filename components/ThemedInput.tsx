import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemedInputProps extends TextInputProps {
  label?: string;
}

export function ThemedInput({ style, label, ...rest }: ThemedInputProps) {
  const color = useThemeColor("text");
  const backgroundColor = useThemeColor("background");

  return (
    <View style={styles.inputContainer}>
      {label ? <ThemedText>{label}</ThemedText> : null}
      <TextInput
        style={[{ color, backgroundColor, ...styles.input }, style]}
        placeholderTextColor={color}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 2,
  },
  label: {
    width: "100%",
    fontSize: 12,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
  },
});
