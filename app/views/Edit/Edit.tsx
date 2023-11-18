import { useState, useCallback } from "react";
import Editor from "@/components/Editor";
import ContentContainer from "@/components/ContentContainer";
import Button from "@/components/Button";
// import Input from "@/components/Input";
import { useCreateBlog } from "@/services/blog";

export default function EditScence() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { fetchFn, error, loading, data } = useCreateBlog();
  const handlePublish = useCallback(() => {
    fetchFn({ title, content: text });
  }, [text]);
  console.log({ error, loading, data });
  return (
    <div className="flex-auto pt-8 flex flex-col">
      <ContentContainer className="flex-auto flex flex-col">
        <div className="flex justify-end py-1 z-10 bg-white sticky top-[--header-height]">
          <Button onClick={handlePublish}>发布</Button>
        </div>
        <input
          value={title}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          placeholder="输入标题"
          className="mt-2 mb-8 outline-none border-none text-4xl font-bold"
        />
        <Editor initialText={text} onChange={setText} className="flex-auto" />
      </ContentContainer>
    </div>
  );
}
