import { minimalSetup, EditorView } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useEffect, useRef } from "react";
import { syntaxHighlighting } from "@codemirror/language";
import highlightTheme from "./highlight";

type EditorProps = {
  initialText: string;
  onChange: (text: string) => void;
};

export default function Editor(props: EditorProps) {
  const { initialText, onChange } = props;
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const view = new EditorView({
      doc: initialText,
      extensions: [
        minimalSetup,
        markdown({ codeLanguages: languages }),
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "20px",
          },
          "&.cm-focused": {
            outline: "none",
          },
        }),
        syntaxHighlighting(highlightTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
      parent: el.current!,
    });

    return () => view.destroy();
  }, []);

  return <div className="flex-auto" ref={el}></div>;
}
