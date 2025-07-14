import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, type ButtonProps } from "react-native";

export function ThemedButton({ title, onPress, color, ...rest }: ButtonProps) {
  const buttonTextColor = useThemeColor("buttonText");

  return (
    <Button
      onPress={onPress}
      title={title}
      color={color || buttonTextColor}
      {...rest}
    />
  );
}
