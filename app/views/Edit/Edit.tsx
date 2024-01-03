import { useState, useCallback, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import ContentContainer from "@/components/ContentContainer";
import Background from "@/components/Background";
import { useBlogDetail, useUpdateBlog } from "@/services/blog";
import image from "@/assets/images/aurora.jpg";
import message from "@/components/Message/message";

export default function EditScence() {
  const [title, setTitle] = useState("");
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
    [updateBlogFn, text, title, categories, blogId],
  );

  useEffect(() => {
    if (isGetDetailSuccess && blogDetailResult) {
      setTitle(blogDetailResult.title);
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
    <div className="flex-auto flex flex-col">
      <Background imageUrl={image} />
      <ContentContainer className="pt-8 flex-auto flex flex-col">
        <BlogEditor
          action="edit"
          idEditDraft={blogDetailResult?.isDraft}
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
    </div>
  );
}
