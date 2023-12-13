import { useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "@/components/Markdown";
import Panel from "@/components/Panel";
import { useBlogDetail } from "@/services/blog";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import moment from "@/utils/moment";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/Button";
import { Blog } from "@/types";
import CategoryTag from "@/components/CategoryTag";
import BlogImage from "@/assets/images/river.jpg";
import { HeadingWithChildren } from "@/utils/marked";
import TableOfContents from "@/components/TableOfContents";

type BlogParams = {
  blogId: string;
};

const BlogScence = () => {
  const { blogId } = useParams<keyof BlogParams>();
  const [tableOfContents, setTableOfContents] = useState<HeadingWithChildren[]>(
    [],
  );
  const [activeHeading, setActiveHeading] = useState<string>();
  const { isError, error, isSuccess, result, isLoading, reload } =
    useBlogDetail(blogId as string);
  const { title, content, createdAt } = result || ({} as Blog);

  return (
    <>
      <Background imageUrl={BlogImage}>
        {result && (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl">{title}</h1>
            {result.categories.length !== 0 && (
              <div className="flex justify-center items-center gap-x-2 mt-2">
                {result.categories.map((category) => (
                  <CategoryTag
                    key={category.id}
                    category={category}
                    className="flex justify-center items-center bg-[rgba(255,255,255,0.4)] px-2 py-1 rounded"
                  />
                ))}
              </div>
            )}
            <div className="mt-8">
              <span>{moment(createdAt).format("llll")}</span>
            </div>
          </div>
        )}
      </Background>
      <ContentContainer className="pt-8">
        {isLoading ? (
          <div className="flex gap-x-5">
            <div className="flex-auto mr-[240px]">
              <Skeleton />
            </div>
          </div>
        ) : isError ? (
          <div className="text-center">
            <p>文章加载失败了，请稍后再试试哦。</p>
            <Button onClick={reload}>重试</Button>
          </div>
        ) : isSuccess ? (
          <div className="flex gap-x-5">
            <Markdown
              text={content}
              onUpdateTableOfContents={setTableOfContents}
              className="flex-auto min-w-0"
              onSetActiveHeading={setActiveHeading}
            />
            <div className="flex-none w-[240px] sticky top-[10vh] self-start">
              <TableOfContents
                contents={tableOfContents}
                activeHeading={activeHeading}
              />
            </div>
          </div>
        ) : (
          !isLoading && <p>No Content</p>
        )}
      </ContentContainer>
    </>
  );
};

export default BlogScence;
