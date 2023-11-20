import React from "react";

import marked from "@/utils/marked";
import "@/assets/styles/markdown.css";

interface MarkdownParserProps {
  text: string | undefined;
}

function MarkdownParser(props: MarkdownParserProps) {
  const { text } = props;
  const html = marked.parse(text || "");

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

export default MarkdownParser;
