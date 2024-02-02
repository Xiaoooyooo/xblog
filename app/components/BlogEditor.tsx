import { useCallback, useState } from "react";
import Button from "./Button";
import CategorySelect, { SelectItemOption as Category } from "./CategorySelect";
import Editor from "./Editor";
import Input from "./Input";
import classNames from "classnames";

type BlogEditorProps = {
  action: "create" | "edit";
  idEditDraft?: boolean;
  text: string;
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
    text,
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
      <div
        className={classNames(
          "flex items-center gap-x-4 py-2 z-10 sticky",
          "top-[--header-height] backdrop-blur-sm",
        )}
      >
        <div className="flex-auto min-w-0">
          <CategorySelect
            categories={categories}
            onCategoriesChange={onCategoriesChange}
          />
        </div>
        <div className="flex-none flex gap-x-2">
          <Button loading={isSaving} onClick={() => handleSave()}>
            {action === "create" ? "保存为草稿" : "保存"}
          </Button>
          {(action === "create" || idEditDraft) && (
            <Button loading={isPublishing} onClick={() => handlePublish()}>
              发布
            </Button>
          )}
        </div>
      </div>
      <Editor
        initialText={text}
        onChange={onContentChange}
        className="flex-auto"
      />
    </>
  );
}
