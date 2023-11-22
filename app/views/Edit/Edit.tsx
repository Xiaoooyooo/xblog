import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";
import ContentContainer from "@/components/ContentContainer";
import Button from "@/components/Button";
// import Input from "@/components/Input";
import { useBlogDetail, useUpdateBlog } from "@/services/blog";
import Background from "@/components/Background";
import image from "@/assets/images/aurora.jpg";

export default function EditScence() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isReadyEdit, setIsReadyEdit] = useState(false);
  const [action, setAction] = useState<"save" | "publish">();
  const { blogId } = useParams();

  const {
    isSuccess: isGetDetailSuccess,
    result: blogDetailResult,
    isError: isGetBlogDetailError,
    error: getBlogDetailError,
    isLoading: isGetBlogDetailLoading,
  } = useBlogDetail(blogId);

  const {
    fetchFn: updateBlogFn,
    isError: isUpdateBlogError,
    error: updateBlogError,
    isLoading: isUpdateBlogLoading,
    isSuccess: isUpdateBlogSuccess,
    result: updateBlogResult,
  } = useUpdateBlog();

  const handleSave = useCallback(
    (isDraft?: false) => {
      setAction(isDraft === false ? "publish" : "save");
      updateBlogFn({ title, content: text, id: blogId!, isDraft });
    },
    [text, title, blogId],
  );

  useEffect(() => {
    if (isGetDetailSuccess && blogDetailResult) {
      setTitle(blogDetailResult.title);
      setText(blogDetailResult.content);
      setIsReadyEdit(true);
    }
  }, [isGetDetailSuccess, blogDetailResult]);

  useEffect(() => {
    if (isUpdateBlogError) {
      __DEV__ && console.log(updateBlogError);
    }
  }, [isUpdateBlogError, updateBlogError]);

  if (isUpdateBlogSuccess && updateBlogResult) {
    return (
      <Navigate to={{ pathname: `/blog/${updateBlogResult.id}` }} replace />
    );
  }

  if (!isReadyEdit) {
    return <div>loading</div>;
  }

  return (
    <div className="flex-auto flex flex-col">
      <Background imageUrl={image} />
      <ContentContainer className="pt-8 flex-auto flex flex-col">
        <div className="flex gap-x-4 justify-end py-1 z-10 sticky top-[--header-height]">
          <Button
            loading={action === "save" && isUpdateBlogLoading}
            onClick={() => handleSave()}
          >
            保存
          </Button>
          {blogDetailResult && blogDetailResult.isDraft && (
            <Button
              loading={action === "publish" && isUpdateBlogLoading}
              onClick={() => handleSave(false)}
            >
              发布
            </Button>
          )}
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
