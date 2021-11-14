import React from "react";

import marked from "utils/marked";
import "assets/styles/markdown.css";

interface MarkdownParserProps extends React.ComponentPropsWithoutRef<"div"> {
  text: string | undefined;
}

class MarkdownParser extends React.Component<MarkdownParserProps> {
  get html() {
    const { text } = this.props;
    if (!text) return "";
    return marked.parse(text);
  }
  render() {
    return (
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: this.html }}
      ></div>
    );
  }
}

export default MarkdownParser;
