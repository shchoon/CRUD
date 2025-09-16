import { db } from "@/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorUid: string;
  createdAt: { toDate: () => Date };
  imageUrl?: string;
};

export default function PostList() {
  const router = useRouter();
  const [posts, setposts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setLoading(true);
        await new Promise((reslove) => setTimeout(reslove, 300));
        try {
          const postsRef = collection(db, "posts");
          const q = query(postsRef, orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);

          const fetchedPosts: Post[] = [];

          snapshot.forEach((doc) => {
            fetchedPosts.push({
              id: doc.id,
              ...doc.data(),
            } as Post);
          });

          setposts(fetchedPosts);
        } catch {
          Alert.alert("게시글을 불러오는 데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();

      return () => {
        setLoading(false);
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>게시글 불러오는 중...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.postMeta}>
        <Text style={styles.authorText}>
          작성자: {item.author} | {item.createdAt.toDate().toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>게시글이 없습니다.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  listContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  postItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  authorText: {
    fontSize: 12,
    color: "#888",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
