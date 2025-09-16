import { User } from "@/type";
import { getUserFromAsyncStorage } from "@/utils/getUserFromAsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Config() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkIsLogin = async () => {
      const getUser = await getUserFromAsyncStorage();
      setUser(getUser);
    };

    checkIsLogin();
  }, []);

  const handleLogout = () => {
    Alert.alert("알림", "정말 로그아웃을 하시겠습니까?", [
      {
        text: "취소",
      },
      {
        text: "확인",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          setUser(null);
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD</Text>

      {user ? (
        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </Pressable>
      ) : (
        <>
          <Link href="/login" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>로그인</Text>
            </Pressable>
          </Link>

          <Link href="/signup" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>회원가입</Text>
            </Pressable>
          </Link>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  button: {
    width: "80%",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
