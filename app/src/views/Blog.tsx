import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Content, ContentBackground } from "layouts";
import MarkdownParser from "components/MarkdownParser";

import { connector, PropsFromRedux } from "store";
import { getBlogById } from "store/BlogsStore";
import Pane from "components/Pane";
import styles from "./Blog.module.scss";

interface BlogParams {
  blogId: string;
}
type BlogScenceProps =
  & React.ComponentPropsWithoutRef<"div">
  & RouteComponentProps<BlogParams>
  & PropsFromRedux;

class BlogScence extends React.Component<BlogScenceProps> {
  render() {
    const {
      match: { params: { blogId } },
      blogStore,
      fetchBlogById
    } = this.props;
    console.log(blogStore);
    const blog = getBlogById(blogStore, blogId);
    console.log(blog);
    if (!blog) {
      fetchBlogById(blogId);
    }
    return (
      <Content className={styles.blogScence}>
        <ContentBackground className={styles.blogBackground} />
        <Pane className={styles.mainContent}>
          <MarkdownParser text={blog?.text} />
        </Pane>
      </Content>
    );
  }
}

export default connector(withRouter(BlogScence));
