import { useParams } from "react-router-dom";

import { Content, ContentBackground } from "@/layouts";
import MarkdownParser from "@/components/MarkdownParser";

import Panel from "@/components/Panel";
import styles from "./Blog.module.scss";
import useBlogWithId from "@/hooks/useBlogWithId";

type BlogParams = {
  blogId: string;
};
type BlogScenceProps = React.ComponentPropsWithoutRef<"div">;

const BlogScence = (props: BlogScenceProps) => {
  const { blogId } = useParams<keyof BlogParams>();
  const { error, loading, data } = useBlogWithId(blogId as string);
  __DEV__ && console.log("isLoading", loading);
  __DEV__ && console.log("BlogScence blog data:", data);
  return (
    <Content className={styles.blogScence}>
      <ContentBackground className={styles.blogBackground} />
      <Panel>
        {error ? (
          <p>fetch error</p>
        ) : data ? (
          <MarkdownParser text={data.text} />
        ) : (
          !loading && <p>No Content</p>
        )}
      </Panel>
    </Content>
  );
};

export default BlogScence;
