/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Text,
  NodeEntry,
  Range,
  Element,
  Node,
  Editor,
} from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
// import Prism from "prismjs";
// import "prismjs/components/prism-markdown";
import renderElement from "./elements";
import renderLeaf from "./leaves";
import withMarkdownShortcuts, { handleDOMBeforeInput } from "./shortcuts";
import classNames from "classnames";

type EditorProps = {
  initialText?: string;
  readOnly?: boolean;
  onChange?: (text: string) => void;
  className?: string;
};

export default function SlateEditor(props: EditorProps) {
  const { initialText = "", readOnly, onChange, className } = props;
  const [initialValue] = useState<Descendant[]>(() =>
    initialText
      .split("\n")
      .map((line) => ({ type: "paragraph", children: [{ text: line }] })),
  );

  const [editor] = useState(withReact(withHistory(createEditor())));

  // const _handleDOMBeforeInput = useCallback(handleDOMBeforeInput(editor), [
  //   editor,
  // ]);

  // const decorate = useCallback(([node, path]: NodeEntry) => {
  //   if (!Editor.isEditor(node)) return [];
  //   console.log("decorate", node);
  //   const ranges: Range[] = [];
  //   // console.log("decorate", Text.isText(node), { node, path });
  //   // if (!Text.isText(node)) {
  //   //   return ranges;
  //   // }

  //   const text = node.children.map((line) => Node.string(line)).join("\n");
  //   // let text: string;
  //   // if (Text.isText(node)) {
  //   //   text = node.text;
  //   // } else {
  //   //   text = node.children.map((line) => Node.string(line)).join("\n");
  //   // }
  //   console.log({ text });
  //   const getLength = (token: string | Prism.Token): number => {
  //     if (typeof token === "string") {
  //       return token.length;
  //     } else if (typeof token.content === "string") {
  //       return token.content.length;
  //     } else {
  //       return (token.content as (string | Prism.Token)[]).reduce(
  //         (l, t) => l + getLength(t),
  //         0,
  //       );
  //     }
  //   };

  //   const tokens = Prism.tokenize(text, Prism.languages.markdown);
  //   let start = 0;
  //   console.log({ tokens });
  //   for (let i = 0; i < tokens.length; i++) {
  //     const token = tokens[i];
  //     const length = getLength(token);
  //     const end = start + length;

  //     if (typeof token !== "string") {
  //       const range: Range = {
  //         // [token.type]: true,
  //         type: token.type,
  //         anchor: { path: [i], offset: start },
  //         focus: { path: [i], offset: end },
  //       };
  //       if (token.type === "title") {
  //         // console.log(token);
  //         range.level = (token.content[0] as Prism.Token).length;
  //       }
  //       ranges.push(range);
  //     }

  //     start = end;
  //   }
  //   console.log({ ranges });
  //   return ranges;
  // }, []);
  const handleValueChange = useMemo(() => {
    if (!onChange) return undefined;
    function getText(nodes: Descendant[]): string {
      return nodes
        .map((node) => {
          if (Text.isText(node)) {
            return node.text;
          }
          return getText(node.children);
        })
        .join("\n");
    }
    return function (value: Descendant[]) {
      __DEV__ && console.log(value);
      onChange(getText(value));
    };
  }, [onChange]);
  // Render the Slate context.
  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      // onChange={(value) => {
      //   console.log("onChange", { value });
      // }}
      onValueChange={handleValueChange}
    >
      <Editable
        // renderElement={renderElement}
        // renderLeaf={renderLeaf}
        // onDOMBeforeInput={_handleDOMBeforeInput}
        // decorate={decorate}
        placeholder="输入正文......"
        readOnly={readOnly}
        className={classNames("outline-none", className)}
      />
    </Slate>
  );
}
