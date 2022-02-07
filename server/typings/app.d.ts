/**
 * information about a blog's header
 */
interface BlogInfo {
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  index_img?: string;
  excerpt: string;
}

/**
 * information about a blog
 */
interface Blog {
  header: BlogInfo;
  content: string;
}

/**
 * information about the database file
 */
interface BlogsInfo {
  blogs: BlogInfo[];
  about: any;
}