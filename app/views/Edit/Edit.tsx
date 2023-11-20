import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@/components/Editor";
import ContentContainer from "@/components/ContentContainer";
import Button from "@/components/Button";
// import Input from "@/components/Input";
import { useCreateBlog, useBlogDetail, useUpdateBlog } from "@/services/blog";

export default function EditScence() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isReadyEdit, setIsReadyEdit] = useState(false);
  const [editorKey, setEditorKey] = useState<"edit" | "create">("create");
  const { blogId } = useParams();
  const isEdit = !!blogId;

  const {
    fetchFn: createBlogFn,
    isError: isCreateBlogError,
    error: createBlogError,
    isLoading: isCreateBlogLoading,
    isSuccess: isCreateBlogSuccess,
    result: createBlogResult,
  } = useCreateBlog();

  const {
    fetchFn: updateBlogFn,
    isError: isUpdateBlogError,
    error: updateBlogError,
    isLoading: isUpdateBlogLoading,
    isSuccess: isUpdateBlogSuccess,
    result: updateBlogResult,
  } = useUpdateBlog();

  const {
    isSuccess: isGetDetailSuccess,
    result: blogDetailResult,
    isError: isGetBlogDetailError,
    error: getBlogDetailError,
    isLoading: isGetBlogDetailLoading,
  } = useBlogDetail(blogId);

  const navigate = useNavigate();

  const handlePublish = useCallback(() => {
    if (isEdit) {
      updateBlogFn({ title, content: text, id: blogId });
    } else {
      createBlogFn({ title, content: text });
    }
  }, [text, title, blogId]);

  useLayoutEffect(() => {
    if (!isEdit) {
      setTitle("");
      setText("");
      setEditorKey("create");
    } else {
      setEditorKey("edit");
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && isGetDetailSuccess && blogDetailResult) {
      setTitle(blogDetailResult.title);
      setText(blogDetailResult.content);
      setIsReadyEdit(true);
    }
  }, [isEdit, isGetDetailSuccess, blogDetailResult]);

  useEffect(() => {
    let id: string | undefined = undefined;
    if (isCreateBlogSuccess && createBlogResult) {
      id = createBlogResult.id;
    } else if (isUpdateBlogSuccess && updateBlogResult) {
      id = updateBlogResult.id;
    }
    if (id) {
      navigate({ pathname: `/blog/${id}` }, { replace: true });
    }
  }, [
    isCreateBlogSuccess,
    createBlogResult,
    isUpdateBlogSuccess,
    updateBlogResult,
  ]);

  useEffect(() => {
    if (isCreateBlogError) {
      __DEV__ && console.log(createBlogError);
    }
    if (isUpdateBlogError) {
      __DEV__ && console.log(updateBlogError);
    }
  }, [isCreateBlogError, createBlogError, isUpdateBlogError, updateBlogError]);

  if (isEdit && !isReadyEdit) {
    return <div>loading</div>;
  }

  return (
    <div className="flex-auto pt-8 flex flex-col">
      <ContentContainer className="flex-auto flex flex-col">
        <div className="flex gap-x-2 justify-end py-1 z-10 bg-white sticky top-[--header-height]">
          {/* <Button>保存为草稿</Button> */}
          <Button
            loading={isCreateBlogLoading || isUpdateBlogLoading}
            onClick={handlePublish}
          >
            发布
          </Button>
        </div>
        <input
          value={title}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          placeholder="输入标题"
          className="mt-2 mb-8 outline-none border-none text-4xl font-bold"
        />
        <Editor
          key={editorKey}
          initialText={text}
          onChange={setText}
          className="flex-auto"
        />
      </ContentContainer>
    </div>
  );
}
