import { useState, useCallback, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import ContentContainer from "@/components/ContentContainer";
import { useBlogDetail, useUpdateBlog } from "@/services/blog";
import message from "@/components/Message/message";
import getBlogTitle from "@/utils/getBlogTitle";

export default function EditScence() {
  const [text, setText] = useState("");
  const [categories, setCategories] = useState<
    { label: string; value: string; isCreated?: boolean }[]
  >([]);
  const [isReadyEdit, setIsReadyEdit] = useState(false);
  const { blogId } = useParams();

  const { isSuccess: isGetDetailSuccess, result: blogDetailResult } =
    useBlogDetail(blogId);

  const {
    fetchFn: updateBlogFn,
    isSuccess: isUpdateSuccess,
    result: updateResult,
  } = useUpdateBlog();

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
      return updateBlogFn({
        title,
        content: text,
        id: blogId!,
        categoriesId,
        createdCategories,
        ...(isPublish ? { isDraft: false } : {}),
      }).then(({ isError, error }) => {
        if (isError) {
          message({ type: "error", message: error.error.message });
        }
      });
    },
    [updateBlogFn, text, categories, blogId],
  );

  useEffect(() => {
    if (isGetDetailSuccess && blogDetailResult) {
      setText(blogDetailResult.content);
      setCategories(
        blogDetailResult.categories.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      );
      setIsReadyEdit(true);
    }
  }, [isGetDetailSuccess, blogDetailResult]);

  if (isUpdateSuccess) {
    return <Navigate to={{ pathname: `/blog/${updateResult.id}` }} replace />;
  }

  if (!isReadyEdit) {
    return <div>loading</div>;
  }

  return (
    <ContentContainer className="pt-8 flex-auto flex flex-col">
      <BlogEditor
        action="edit"
        idEditDraft={blogDetailResult?.isDraft}
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
