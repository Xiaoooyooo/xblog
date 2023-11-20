import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import BlogEditor from "@/components/BlogEditor";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { useCreateBlog } from "@/services/blog";

export default function CreateScene() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { fetchFn, isError, error, isLoading, isSuccess, result } =
    useCreateBlog();

  const handlePublish = useCallback(
    (isDraft = false) => {
      fetchFn({ title, content: text, isDraft });
    },
    [text, title],
  );

  return (
    <div className="flex-auto pt-8 flex flex-col">
      <ContentContainer className="flex-auto flex flex-col">
        <div className="flex gap-x-2 justify-end py-1 z-10 bg-white sticky top-[--header-height]">
          <Button loading={isLoading} onClick={() => handlePublish(true)}>
            保存为草稿
          </Button>
          <Button loading={isLoading} onClick={() => handlePublish()}>
            发布
          </Button>
        </div>
        <BlogEditor
          title={title}
          text={text}
          onTitleChange={setTitle}
          onContentChange={setText}
        />
      </ContentContainer>
    </div>
  );
}
