import { useCallback, useState } from "react";
import Button from "./Button";
import CategorySelect, { SelectItemOption as Category } from "./CategorySelect";
import Editor from "./Editor";
import Input from "./Input";

type BlogEditorProps = {
  action: "create" | "edit";
  idEditDraft?: boolean;
  title: string;
  text: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  categories: Category[];
  onCategoriesChange: (value: Category[]) => void;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
};

export default function BlogEditor(props: BlogEditorProps) {
  const {
    action,
    idEditDraft,
    title,
    text,
    onTitleChange,
    onContentChange,
    categories,
    onCategoriesChange,
    onSave,
    onPublish,
  } = props;

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSave = useCallback(() => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    onSave().finally(() => {
      setIsSaving(false);
    });
  }, [isSaving, onSave]);

  const handlePublish = useCallback(() => {
    if (isPublishing) {
      return;
    }
    setIsPublishing(true);
    onPublish().finally(() => {
      setIsPublishing(false);
    });
  }, [isPublishing, onPublish]);

  return (
    <>
      <div className="flex gap-x-4 justify-end py-1 z-10 sticky top-[--header-height]">
        <Button loading={isSaving} onClick={() => handleSave()}>
          {action === "create" ? "保存为草稿" : "保存"}
        </Button>
        {(action === "create" || idEditDraft) && (
          <Button loading={isPublishing} onClick={() => handlePublish()}>
            发布
          </Button>
        )}
      </div>
      <CategorySelect
        categories={categories}
        onCategoriesChange={onCategoriesChange}
      />
      <Input
        value={title}
        type="plain"
        onInput={onTitleChange}
        placeholder="输入标题"
        className="mt-2 mb-8 outline-none border-none text-4xl font-bold"
      />
      <Editor
        initialText={text}
        onChange={onContentChange}
        className="flex-auto"
      />
    </>
  );
}
