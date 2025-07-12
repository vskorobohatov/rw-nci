import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, type ButtonProps } from "react-native";

export type ThemedButtonProps = ButtonProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
  onPress?: () => void;
};

export function ThemedButton({
  lightColor,
  darkColor,
  title,
  onPress,
  ...rest
}: ThemedButtonProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonText"
  );

  return <Button onPress={onPress} title={title} color={color} {...rest} />;
}
