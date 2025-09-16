import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, statusBarStyle: "dark" }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, statusBarStyle: "dark" }}
        />
        <Stack.Screen
          name="signup"
          options={{ headerShown: false, statusBarStyle: "dark" }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{ headerShown: false, statusBarStyle: "dark" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
