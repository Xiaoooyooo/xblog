export type UserInfo = {
  id: string;
  username: string;
  displayName: string;
  token: string;
  isLogin: boolean;
};

export type Blog = {
  id: string;
  title: string;
  cover?: string;
  text: string;
  category: string;
  tags: string[];
  url: string;
  createdAt: number;
};
