import { db } from "@/firebaseConfig";
import { getUserFromAsyncStorage } from "@/utils/getUserFromAsyncStorage";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { Comment, Post, User } from "@/type";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  postId: string;
  post: Post;
};

export default function Comments({ postId, post }: Props) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("알림", "댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = (await getUserFromAsyncStorage()) as User;

      const commentsRef = collection(db, "posts", postId, "comments");

      await addDoc(commentsRef, {
        text: newComment.trim(),
        author: user.nickname,
        authorId: user.uid,
        createdAt: new Date(),
      });

      fetchComments();
    } catch (error: any) {
      console.log(error);
      Alert.alert("오류", "댓글 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setNewComment("");
    }
  };

  const fetchComments = useCallback(() => {
    const getComments = async () => {
      setloading(true);
      const commentsDocRef = collection(db, "posts", postId, "comments");
      const q = query(commentsDocRef, orderBy("createdAt", "desc"));
      const commentsSnap = await getDocs(q);

      const fetchedComments: Comment[] = [];
      commentsSnap.forEach((doc) => {
        fetchedComments.push({
          id: doc.id,
          ...doc.data(),
        } as Comment);
      });

      setComments(fetchedComments);
      setloading(false);
    };

    getComments();
  }, [postId]);

  useFocusEffect(fetchComments);

  const renderItem = ({ item }: { item: Comment }) => {
    return (
      <View style={styles.commentItem}>
        <Text style={styles.commentAuthor}>{item.author}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentDate}>
          {item.createdAt.toDate().toLocaleString()}
        </Text>
      </View>
    );
  };

  const PostContent = () => {
    return (
      <View style={{ flex: 1, padding: 12 }}>
        <View style={{ padding: 20 }}>
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
        </View>
        <Text style={styles.sectionTitle}>댓글</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={comments}
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={renderItem}
        ListHeaderComponent={PostContent}
        ListFooterComponent={
          loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>댓글 불러오는 중...</Text>
            </View>
          ) : null
        }
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading ? (
            <View style={{ flex: 1, backgroundColor: "#f9f9f9", padding: 20 }}>
              <Text style={styles.noCommentsText}>아직 댓글이 없습니다.</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.commentForm}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          editable={!isSubmitting}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddComment}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>작성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
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
  commentItem: {
    backgroundColor: "#eef2f7",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowOpacity: 0.1,
    shadowRadius: 3.84,

    elevation: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentForm: {
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
