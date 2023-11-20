export type User = {
  id: string;
  username: string;
  displayName: string;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  user: User;
  isDraft: boolean;
  // category: string;
  // tags: string[];
  createdAt: number;
  updatedAt: number;
};
