import { useParams } from "react-router-dom";

import MarkdownParser from "@/components/MarkdownParser";
import Panel from "@/components/Panel";
import { useBlogDetail } from "@/services/blog";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import moment from "@/utils/moment";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/Button";
import { Blog } from "@/types";
import BlogImage from "@/assets/images/river.jpg";

type BlogParams = {
  blogId: string;
};

const BlogScence = () => {
  const { blogId } = useParams<keyof BlogParams>();
  const { isError, error, isSuccess, result, isLoading, reload } =
    useBlogDetail(blogId as string);
  const { title, content, createdAt } = result || ({} as Blog);
  __DEV__ && console.log({ isError, error, isSuccess, result, isLoading });
  return (
    <>
      <Background imageUrl={BlogImage}>
        {result && (
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
          ) : isLoading ? (
            <Skeleton />
          ) : result ? (
            <MarkdownParser text={content} />
          ) : (
            !isLoading && <p>No Content</p>
          )}
        </Panel>
      </ContentContainer>
    </>
  );
};

export default BlogScence;
