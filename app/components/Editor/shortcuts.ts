import { CustomEditor } from "./types";
import { Range, Element, Editor, Transforms, Node } from "slate";
import { ReactEditor } from "slate-react";

const SHORTCUTS = {
  // "```": "code",
};

export default function withMarkdownShortcuts(editor: CustomEditor) {
  const { deleteBackward, insertText, insertBreak } = editor;

  // editor.insertText = (text) => {
  //   const { selection } = editor;
  //   console.log({ text });

  //   const block = Editor.above(editor, {
  //     match: (n) => {
  //       console.log({ n });
  //       return Element.isElement(n) && Editor.isBlock(editor, n);
  //     },
  //   });
  //   console.log({ block });
  //   if (selection && Range.isCollapsed(selection)) {
  //     const { anchor } = selection;
  //     const path = block ? block[1] : [];
  //     const start = Editor.start(editor, path);
  //     const range = { anchor, focus: start };
  //     const beforeText = Editor.string(editor, range) + text.slice(0, -1);
  //     const type = SHORTCUTS[beforeText];

  //     if (type) {
  //       Transforms.select(editor, range);

  //       if (!Range.isCollapsed(range)) {
  //         Transforms.delete(editor);
  //       }

  //       const newProperties: Partial<Element> = {
  //         type,
  //       };
  //       Transforms.setNodes<Element>(editor, newProperties, {
  //         match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  //       });

  //       if (type === "list-item" || type === "code") {
  //         const list: BulletedListElement = {
  //           type: type,
  //           children: [],
  //         };
  //         Transforms.wrapNodes(editor, list, {
  //           match: (n) =>
  //             !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
  //         });
  //       }

  //       return;
  //     }
  //   }
  //   editor.insertNode;
  //   Transforms.insertNodes;
  //   editor.after;
  //   editor.select;
  //   editor.end;
  //   editor.above;
  //   editor.next;
  //   insertText(text);
  // };

  // editor.insertBreak = (...args) => {
  //   console.log({ args });
  //   const codeSchema = editor.above({
  //     match: (node) =>
  //       Element.isElement(node) && node.type === "code-schema-footer",
  //   });
  //   if (codeSchema) {
  //     console.log({ codeSchema });
  //     insertBreak(...args);
  //     Transforms.setNodes(
  //       editor,
  //       { type: "paragraph" },
  //       {
  //         match: (node) =>
  //           Element.isElement(node) && Editor.isBlock(editor, node),
  //       },
  //     );
  //     Transforms.unwrapNodes(editor, {
  //       match: (node) => Element.isElement(node) && node.type === "code",
  //       split: true,
  //     });
  //     return;
  //   }
  //   insertBreak(...args);
  //   Transforms.setNodes(
  //     editor,
  //     { type: "paragraph" },
  //     {
  //       mode: "highest",
  //     },
  //   );
  // };
  return editor;
}

export function handleDOMBeforeInput(editor: CustomEditor) {
  return function (e: InputEvent) {
    console.log(1111);
    queueMicrotask(() => {
      const pendingDiffs = ReactEditor.androidPendingDiffs(editor);
      console.log({ pendingDiffs });

      const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
        if (!diff.text.endsWith(" ")) {
          return false;
        }

        const { text } = Node.leaf(editor, path);
        const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1);
        if (!(beforeText in SHORTCUTS)) {
          return;
        }

        const blockEntry = Editor.above(editor, {
          at: path,
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        });
        if (!blockEntry) {
          return false;
        }

        const [, blockPath] = blockEntry;
        return Editor.isStart(editor, Editor.start(editor, path), blockPath);
      });

      if (scheduleFlush) {
        ReactEditor.androidScheduleFlush(editor);
      }
    });
  };
}
