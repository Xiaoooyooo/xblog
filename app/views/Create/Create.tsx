import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import ContentContainer from "@/components/ContentContainer";
import { useCreateBlog } from "@/services/blog";
import message from "@/components/Message/message";

export default function CreateScene() {
  const [title, setTitle] = useState("");
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
    [fetchFn, text, title, categories],
  );

  if (isSuccess) {
    return <Navigate to={{ pathname: `/blog/${result.id}` }} replace />;
  }

  return (
    <ContentContainer className="pt-8 flex-auto flex flex-col">
      <BlogEditor
        action="create"
        title={title}
        text={text}
        onTitleChange={setTitle}
        onContentChange={setText}
        categories={categories}
        onCategoriesChange={setCategories}
        onSave={() => handlePublish(false)}
        onPublish={() => handlePublish(true)}
      />
    </ContentContainer>
  );
}
