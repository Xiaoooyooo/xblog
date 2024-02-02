import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import ContentContainer from "@/components/ContentContainer";
import { useCreateBlog } from "@/services/blog";
import message from "@/components/Message/message";
import getBlogTitle from "@/utils/getBlogTitle";

export default function CreateScene() {
  const [text, setText] = useState("");
  const [categories, setCategories] = useState<
    { label: string; value: string; isCreated?: boolean }[]
  >([]);

  const { fetchFn, isSuccess, result } = useCreateBlog();

  const handlePublish = useCallback(
    async (isPublish: boolean) => {
      const categoriesId: string[] = [];
      const createdCategories: string[] = [];
      categories.forEach((item) => {
        if (item.isCreated) {
          createdCategories.push(item.value);
        } else {
          categoriesId.push(item.value);
        }
      });
      const title = getBlogTitle(text);
      if (!title) {
        message({ type: "error", message: "title is Required!" });
        return;
      }
      return fetchFn({
        title,
        content: text,
        categoriesId,
        createdCategories,
        ...(isPublish ? { isDraft: false } : {}),
      }).then(({ isError, error }) => {
        if (isError) {
          message({ type: "error", message: error.error.message });
        }
      });
    },
    [fetchFn, text, categories],
  );

  if (isSuccess) {
    return <Navigate to={{ pathname: `/blog/${result.id}` }} replace />;
  }

  return (
    <ContentContainer className="pt-8 flex-auto flex flex-col">
      <BlogEditor
        action="create"
        text={text}
        onContentChange={setText}
        categories={categories}
        onCategoriesChange={setCategories}
        onSave={() => handlePublish(false)}
        onPublish={() => handlePublish(true)}
      />
    </ContentContainer>
  );
}
