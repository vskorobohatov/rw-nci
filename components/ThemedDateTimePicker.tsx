import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { ThemedText } from "./ThemedText";

interface PickerProps {
  label?: string;
  buttonText: string;
  value: Date;
  onChange: (value: Date) => void;
  disabled?: boolean;
  mode?: "datetime" | "date" | "time";
}

export function ThemedDateTimePicker({
  label,
  buttonText,
  mode = "time",
  value,
  onChange,
  disabled,
}: PickerProps) {
  const [open, setOpen] = useState(false);
  const backgroundColor = useThemeColor("background");

  return (
    <View style={styles.inputContainer}>
      {label ? <ThemedText>{label}</ThemedText> : null}
      <Pressable
        disabled={disabled}
        style={[styles.button, { backgroundColor }]}
        onPress={() => setOpen(true)}
      >
        <ThemedText>{buttonText}</ThemedText>
      </Pressable>
      <DatePicker
        modal
        mode={mode}
        open={open && !disabled}
        date={value}
        onConfirm={(date) => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
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
  button: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
});
