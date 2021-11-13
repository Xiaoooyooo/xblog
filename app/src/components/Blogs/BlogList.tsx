import React from "react";

import BlogItem from "./BlogItem";

interface BlogListProps extends React.ComponentProps<"div"> {
  blogs: Blog[];
}

class BlogList extends React.Component<BlogListProps> {

  render() {
    const { blogs } = this.props;
    return blogs.map((blog, i) => (
      <BlogItem key={i} blog={blog} />
    ));
  }
}

export default BlogList;
