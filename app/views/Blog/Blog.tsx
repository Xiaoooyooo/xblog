import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "@/components/Markdown/Markdown";
import { useBlogDetail } from "@/services/blog";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import moment from "@/utils/moment";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/Button";
import { Blog } from "@/types";
import CategoryTag from "@/components/CategoryTag";
import TableOfContents from "@/components/TableOfContents";
import EyeIcon from "@/assets/icons/eye.svg";
import ViewUpdater from "./ViewUpdater";
import { HeadingWithChildren } from "@/components/Markdown/parser";
import TagsIcon from "@/assets/icons/tags.svg";
import BlogImage from "@/assets/images/stars.jpg";

type BlogParams = {
  blogId: string;
};

const BlogScence = () => {
  const { blogId } = useParams<keyof BlogParams>();
  const [tableOfContents, setTableOfContents] = useState<HeadingWithChildren[]>(
    [],
  );
  const [activeHeading, setActiveHeading] = useState<string>();
  const [views, setViews] = useState(0);
  const { isError, error, isSuccess, result, isLoading, reload } =
    useBlogDetail(blogId as string);

  useLayoutEffect(() => {
    if (result) {
      setViews(result.views);
    }
  }, [result]);

  const { title, content, createdAt } = result || ({} as Blog);

  return (
    <>
      <Background imageUrl={BlogImage}>
        {result && (
          <div className="pt-[--header-height] h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-xl md:text-4xl text-center">{title}</h1>
            {result.categories.length !== 0 && (
              <div className="flex justify-center items-center gap-x-2 mt-4">
                <TagsIcon height={18} width={18} />
                {result.categories.map((category) => (
                  <CategoryTag
                    key={category.id}
                    category={category}
                    // className="flex justify-center items-center bg-[rgba(255,255,255,0.4)] px-2 py-1 rounded"
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-x-2 text-sm">
              <span>{moment(createdAt).format("llll")}</span>
              {!result.isDraft && (
                <span>
                  <EyeIcon className="inline align-[-2px] mr-1" />
                  {views}
                </span>
              )}
            </div>
          </div>
        )}
      </Background>
      <ContentContainer className="pt-8">
        {isLoading ? (
          <div className="flex gap-x-5">
            <Skeleton className="flex-auto" animated />
            <Skeleton
              className="hidden md:block basis-[240px]"
              animated
              rows={3}
            />
          </div>
        ) : isError ? (
          <div className="text-center">
            <p>文章加载失败了，请稍后再试试哦。</p>
            <Button onClick={reload}>重试</Button>
          </div>
        ) : isSuccess ? (
          <>
            <div className="flex gap-x-5">
              <Markdown
                text={content}
                onUpdateTableOfContents={setTableOfContents}
                className="flex-auto min-w-0"
                onSetActiveHeading={setActiveHeading}
              />
              <div className="hidden md:block flex-none w-[240px] sticky top-[10vh] self-start">
                <TableOfContents
                  contents={tableOfContents}
                  activeHeading={activeHeading}
                />
              </div>
            </div>
            {!result.isDraft && (
              <ViewUpdater blogId={result.id} onUpdated={setViews} />
            )}
          </>
        ) : (
          !isLoading && <p>No Content</p>
        )}
      </ContentContainer>
    </>
  );
};

export default BlogScence;
