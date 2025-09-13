import { checkEmptyForm } from "@/utils/checkEmptyForm";
import React, { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";

type SignUpFormState = {
  email: string;
  password: string;
  nickname: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const [signUp, setSignUp] = useState<SignUpFormState>({
    email: "",
    password: "",
    nickname: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChangeSignUpForm = (
    key: keyof SignUpFormState,
    value: string
  ) => {
    setSignUp((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignUp = async () => {
    if (checkEmptyForm(signUp)) {
      Alert.alert("회원가입 실패", "모든 필드를 입력해 주세요.");
      return;
    }

    // 최소 비밀번호 길이 검사
    if (signUp.password.length < 6) {
      Alert.alert("회원가입 실패", "비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true); // 로딩 시작

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUp.email,
        signUp.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nickname: signUp.nickname,
        createdAt: new Date(),
      });

      Alert.alert(
        "회원가입 성공",
        `${signUp.nickname}님, 가입이 완료되었습니다!`,
        [
          {
            text: "확인",
            onPress: () => router.push("/login"),
          },
        ]
      );

      setSignUp({ email: "", password: "", nickname: "" });
    } catch (error: any) {
      let errorMessage = "회원가입에 실패했습니다. 다시 시도해주세요.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "이미 사용 중인 이메일 주소입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 주소입니다.";
          break;
      }
      Alert.alert("회원가입 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={signUp.email}
        onChangeText={(value) => handleChangeSignUpForm("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading} // 로딩 중에는 입력 비활성화
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={signUp.password}
        onChangeText={(value) => handleChangeSignUpForm("password", value)}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={signUp.nickname}
        onChangeText={(value) => handleChangeSignUpForm("nickname", value)}
        editable={!loading}
      />

      <Button
        title={loading ? "가입 중..." : "회원가입"}
        onPress={handleSignUp}
        disabled={loading}
      />
    </KeyboardAvoidingView>
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
