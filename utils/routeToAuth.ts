import { router as expoRouter } from "expo-router";
import { Alert } from "react-native";

export const RouteToAuth = async (router: typeof expoRouter) => {
  Alert.alert("알림", "해당 서비스를 위해서는 로그인이 필요합니다.", [
    {
      text: "회원가입",
      onPress: () => router.push("/signup"),
    },
    {
      text: "로그인",
      onPress: () => router.push("/login"),
    },
  ]);
};
