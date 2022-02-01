/* eslint-disable @typescript-eslint/no-explicit-any */
interface XhrResponse<T = any> {
  status: number;
  data: T
}

interface Blog {
  id: string;
  title: string;
  cover?: string;
  text: string;
  category: string;
  tags: string[];
  url: string;
  createdAt: string;
}