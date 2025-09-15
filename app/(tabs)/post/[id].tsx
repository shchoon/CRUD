import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router"; // Expo Router에서 동적 파라미터 가져오기
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorUid: string;
  createdAt: { toDate: () => Date };
  imageUrl: string | null;
};

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const postDocRef = doc(db, "posts", id as string);
        const docSnap = await getDoc(postDocRef);

        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
          } as Post);
        } else {
          Alert.alert("오류", "게시글을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        Alert.alert("오류", "게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => {
      setPost(null);
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>게시글을 불러오는 중...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>게시글이 존재하지 않습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.metaContainer}>
        <Text style={styles.author}>작성자: {post.author}</Text>
        <Text style={styles.date}>
          {post.createdAt.toDate().toLocaleString()}
        </Text>
      </View>
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  author: {
    fontSize: 14,
    color: "#888",
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
