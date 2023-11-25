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
  categories: Category[];
  // tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type Category = {
  id: string;
  name: string;
};

export type List<T = unknown> = {
  page: number;
  index: number;
  total: number;
  list: T[];
};
