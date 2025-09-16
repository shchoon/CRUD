import type { User } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserFromAsyncStorage = async (): Promise<User | null> => {
  const getUser = await AsyncStorage.getItem("user");
  if (!getUser) {
    return null;
  }
  const user = JSON.parse(getUser);

  return user;
};
