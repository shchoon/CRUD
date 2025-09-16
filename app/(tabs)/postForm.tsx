import { checkEmptyForm } from "@/utils/checkEmptyForm";
import { getUserFromAsyncStorage } from "@/utils/getUserFromAsyncStorage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

type Form = {
  title: string;
  content: string;
  image: null | string;
};

export default function PostForm() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const handleChangeForm = (key: keyof Form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setForm((prev) => ({
        ...prev,
        image: result.assets[0].uri,
      }));
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = ref(storage, `images/${filename}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const handleSubmit = async () => {
    if (checkEmptyForm(form)) {
      Alert.alert("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const user = await getUserFromAsyncStorage();

      if (!user) {
        Alert.alert("알림", "게시글을 작성하기 위해서는 로그인이 필요합니다.", [
          {
            text: "회원가입",
            onPress: () => router.push("/signup"),
          },
          {
            text: "로그인",
            onPress: () => router.push("/login"),
          },
        ]);
        return;
      }

      let imageUrl = null;
      if (form.image) {
        imageUrl = await uploadImage(form.image);
      }
      await addDoc(collection(db, "posts"), {
        title: form.title.trim(),
        content: form.content.trim(),
        createdAt: new Date(),
        author: user.nickname,
        authorUid: user.uid,
        imageUrl: imageUrl,
      });
      Alert.alert("작성 완료", "글이 성공적으로 등록되었습니다.", [
        {
          text: "남아있기",
        },
        {
          text: "게시글 보기",
          onPress: () => router.push("/post"),
        },
      ]);
    } catch {
      Alert.alert("다시 시도해주세요");
    } finally {
      setLoading(false);
      setForm({ title: "", content: "", image: null });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>새 글 작성</Text>

        <TextInput
          style={styles.inputTitle}
          placeholder="제목을 입력하세요"
          value={form.title}
          onChangeText={(value) => handleChangeForm("title", value)}
          editable={!loading}
        />

        <TextInput
          style={styles.inputContent}
          placeholder="내용을 입력하세요"
          value={form.content}
          onChangeText={(value) => handleChangeForm("content", value)}
          multiline={true}
          textAlignVertical="top"
          editable={!loading}
        />

        <View style={styles.imagePickerContainer}>
          <Button title="이미지 선택" onPress={pickImage} disabled={loading} />
          {form.image && (
            <Image source={{ uri: form.image }} style={styles.imagePreview} />
          )}
        </View>

        <Button
          title={loading ? "업로드 중.." : "글쓰기"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputTitle: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  inputContent: {
    height: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    resizeMode: "contain",
    borderRadius: 8,
  },
});
