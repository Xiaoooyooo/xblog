import React from "react";

import BlogItem from "./BlogItem";

interface BlogListProps extends React.ComponentProps<"div"> {
  blogs: Blog[];
}

function BlogList(props: BlogListProps) {
  const { blogs } = props;
  return blogs.map((blog, i) => <BlogItem key={i} blog={blog} />);
}

export default BlogList;
