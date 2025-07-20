import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { ThemedText } from "./ThemedText";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  value?: string;
  options: Option[];
  onSelect: (selectedItem: any, index: number) => void;
  disabled?: boolean;
}

export function ThemedSelect({
  label,
  value,
  options,
  onSelect,
  disabled = false,
}: CustomSelectProps) {
  const dropdownRef = useRef<any>(null);
  const background = useThemeColor("background");
  const buttonTextColor = useThemeColor("text");
  const selectedBg = useThemeColor("selectedOption");
  const borderColor = useThemeColor("inputBorder");

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef?.current?.selectIndex(
        options.findIndex((it) => it.value === value)
      );
    }
  }, [value, dropdownRef.current]);

  return (
    <View style={styles.selectContainer}>
      {label ? <ThemedText>{label}</ThemedText> : null}
      <SelectDropdown
        ref={dropdownRef}
        data={options}
        defaultValue={value}
        onSelect={onSelect}
        disabled={disabled}
        renderButton={(selectedItem) => {
          return (
            <View
              style={[
                styles.dropdownButtonStyle,
                { borderColor, backgroundColor: background },
              ]}
            >
              <Text
                style={[
                  styles.dropdownButtonTxtStyle,
                  { color: buttonTextColor },
                ]}
              >
                {selectedItem ? selectedItem.label : "Select"}
              </Text>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: selectedBg }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={[
          styles.dropdownMenuStyle,
          { backgroundColor: background, borderColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 2,
  },
  label: {
    width: "100%",
    fontSize: 12,
  },
  dropdownButtonStyle: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
});
