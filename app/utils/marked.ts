import { Marked, MarkedExtension } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

function getMarked(...exts: MarkedExtension[]) {
  return new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
    ...exts,
  );
}

export default getMarked;
