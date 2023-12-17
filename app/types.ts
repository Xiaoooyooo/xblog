export type User = {
  id: string;
  username: string;
  displayName: string;
};

export type UserProfile = {
  avatar: string;
  introduction: string;
  resume: string;
};

export type UserWithProfile = User & UserProfile;

export type Blog = {
  id: string;
  title: string;
  content: string;
  user: User;
  isDraft: boolean;
  categories: Category[];
  // tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: User;
  documents?: number;
};

export type List<T = unknown> = {
  index: number;
  size: number;
  total: number;
  list: T[];
};
