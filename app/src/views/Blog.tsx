import React from "react";
import { useParams } from "react-router-dom";

import { Content, ContentBackground } from "layouts";
import MarkdownParser from "components/MarkdownParser";

import { useAppDispatch, useAppSelector } from "hooks/store";
import { fetchBlogById } from "store/BlogsStore";
import Pane from "components/Pane";
import styles from "./Blog.module.scss";

type BlogParams = {
  blogId: string
}
type BlogScenceProps =
  & React.ComponentPropsWithoutRef<"div">;

const BlogScence: React.FunctionComponent<BlogScenceProps> = (props) => {
  const { blogId } = useParams<keyof BlogParams>();
  const blog = useAppSelector(state =>
    state.blogStore.data.find(el => el.id === blogId)
  );
  const [isLoading, changeLoadingStatus] = React.useState(!blog);
  console.log("isLoading", isLoading);
  console.log("BlogScence blog data:", blog);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (!blog) {
      dispatch(fetchBlogById(blogId as string))
        .then(res => {
          console.log("blog fetch done.", res);
          changeLoadingStatus(false);
        });
    }
  }, []);

  return (
    <Content className={styles.blogScence}>
      <ContentBackground className={styles.blogBackground} />
      <Pane className={styles.mainContent} loading={isLoading}>
        {
          blog
            ? <MarkdownParser text={blog.text} />
            : !isLoading && <p>No Content</p>
        }
      </Pane>
    </Content>
  );
};

export default BlogScence;
