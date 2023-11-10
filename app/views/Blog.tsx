import { useParams } from "react-router-dom";

import MarkdownParser from "@/components/MarkdownParser";
import Panel from "@/components/Panel";
import useBlogWithId from "@/hooks/useBlogWithId";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import BlogImage from "@/assets/images/window.jpg";
import moment from "@/utils/moment";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/Button";
import { Blog } from "@/types";

type BlogParams = {
  blogId: string;
};

const BlogScence = () => {
  const { blogId } = useParams<keyof BlogParams>();
  const { error, loading, data, reload } = useBlogWithId(blogId as string);
  const { title, text, createdAt, category, tags } = data || ({} as Blog);
  __DEV__ && console.log("isLoading", loading);
  __DEV__ && console.log("BlogScence blog data:", data);
  return (
    <>
      <Background imageUrl={BlogImage}>
        {data && (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl">{title}</h1>
            <div className="mt-8">
              <span>{moment(createdAt).format("llll")}</span>
            </div>
          </div>
        )}
      </Background>
      <ContentContainer>
        <Panel>
          {error ? (
            <div className="text-center">
              <p>文章加载失败了，请稍后再试试哦。</p>
              <Button onClick={reload}>重试</Button>
            </div>
          ) : loading ? (
            <Skeleton />
          ) : data ? (
            <MarkdownParser text={text} />
          ) : (
            !loading && <p>No Content</p>
          )}
        </Panel>
      </ContentContainer>
    </>
  );
};

export default BlogScence;
