interface Blog {
  id: string;
  title: string;
  cover?: string;
  text: string;
  category: string;
  tags: string[];
  url: string;
  createdAt: number;
}

type BlogListResponse = {
  pageIndex: number;
  pageSize: number;
  total: number;
  blogs: Blog[];
};
