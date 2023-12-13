import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import BlogEditor from "@/components/BlogEditor";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { useCreateBlog } from "@/services/blog";
import { Navigate } from "react-router-dom";
import Background from "@/components/Background";
import CategorySelect from "@/components/CategorySelect";
import image from "@/assets/images/wave.jpg";

export default function CreateScene() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [categories, setCategories] = useState<
    { label: string; value: string; isCreated?: boolean }[]
  >([]);
  const { fetchFn, isError, error, isLoading, isSuccess, result } =
    useCreateBlog();
  const [action, setAction] = useState<"save" | "publish">();

  const handlePublish = useCallback(
    (isDraft = false) => {
      setAction(isDraft ? "save" : "publish");
      const categoriesId: string[] = [];
      const createdCategories: string[] = [];
      categories.forEach((item) => {
        if (item.isCreated) {
          createdCategories.push(item.value);
        } else {
          categoriesId.push(item.value);
        }
      });
      fetchFn({
        title,
        content: text,
        isDraft,
        categoriesId,
        createdCategories,
      });
    },
    [text, title],
  );

  if (isSuccess && result) {
    return <Navigate to={{ pathname: `/blog/${result.id}` }} replace />;
  }

  return (
    <div className="flex-auto flex flex-col">
      <Background imageUrl={image} />
      <ContentContainer className="pt-8 flex-auto flex flex-col">
        <div className="flex gap-x-4 justify-end py-1 z-10 sticky top-[--header-height]">
          <Button
            loading={action === "save" && isLoading}
            onClick={() => handlePublish(true)}
          >
            保存为草稿
          </Button>
          <Button
            loading={action === "publish" && isLoading}
            onClick={() => handlePublish()}
          >
            发布
          </Button>
        </div>
        <CategorySelect
          categories={categories}
          onCategoriesChange={setCategories}
        />
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
