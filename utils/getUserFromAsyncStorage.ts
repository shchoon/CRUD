import type { User } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserFromAsyncStorage = async (): Promise<User> => {
  const getUser = (await AsyncStorage.getItem("user")) as string;
  const user = JSON.parse(getUser);

  return user;
};
