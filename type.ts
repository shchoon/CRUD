export type User = {
  uid: string;
  nickname: string;
  email: string;
};

export type Comment = {
  id: string;
  text: string;
  authorId: string;
  createdAt: { toDate: () => Date };
  author: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorUid: string;
  createdAt: { toDate: () => Date };
  imageUrl: string | null;
};
