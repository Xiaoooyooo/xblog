import { useState, useCallback } from "react";
import BlogEditor from "@/components/BlogEditor";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { useCreateBlog } from "@/services/blog";
import { useNavigate } from "react-router-dom";
import Background from "@/components/Background";
import CategorySelect from "@/components/CategorySelect";
import image from "@/assets/images/wave.jpg";
import message from "@/components/Message/message";

export default function CreateScene() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [categories, setCategories] = useState<
    { label: string; value: string; isCreated?: boolean }[]
  >([]);
  const { fetchFn, isLoading } = useCreateBlog();
  const [action, setAction] = useState<"save" | "publish">();
  const navigate = useNavigate();

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
      }).then(({ isSuccess, result, isError, error }) => {
        if (isSuccess && result) {
          navigate({ pathname: `/blog/${result.id}` }, { replace: true });
        } else if (isError) {
          message({ type: "error", message: error.error.message });
        }
      });
    },
    [text, title, categories],
  );

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
