/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    buttonText: "#0050a0ff",
    error: "#bb2b2bff",
    success: "#0aa44dff",
    selectedOption: "#9ab1c8ff",
    inputBorder: "#D1D1D1",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    buttonText: "#a6afd9ff",
    error: "#bb2b2bff",
    success: "#0aa44dff",
    selectedOption: "#213951ff",
    inputBorder: "#D1D1D1",
  },
};
