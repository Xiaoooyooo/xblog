import Editor from "./Editor";
import Input from "./Input";

type BlogEditorProps = {
  title: string;
  text: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function BlogEditor(props: BlogEditorProps) {
  const { title, text, onTitleChange, onContentChange } = props;

  return (
    <>
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
