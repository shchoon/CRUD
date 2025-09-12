import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../firsebaseConfig";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChangeLoginForm = (key: keyof LoginForm, value: string) => {
    setLoginForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const login = async () => {
    setLoading(true);

    if (Object.values(login).some((value) => value === "")) {
      Alert.alert("회원가입 실패", "모든 필드를 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userInfo = await getDoc(userDocRef);

      if (userInfo.exists()) {
        const userData = userInfo.data();
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-login-credentials") {
        Alert.alert(
          "로그인 실패",
          "이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요."
        );
      } else {
        Alert.alert("오류", "로그인 중 알 수 없는 오류가 발생했습니다.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={loginForm.email}
        onChangeText={(value) => handleChangeLoginForm("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading} // 로딩 중에는 입력 비활성화
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={loginForm.password}
        onChangeText={(value) => handleChangeLoginForm("password", value)}
        secureTextEntry
        editable={!loading}
      />

      <Button
        title={loading ? "가입 중..." : "회원가입"}
        onPress={login}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
