import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor("text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "error" ? styles.error : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 18,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 22,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 18,
    fontSize: 14,
    color: "#0a7ea4",
  },
  error: {
    color: "#FF231F7C",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
  },
});
