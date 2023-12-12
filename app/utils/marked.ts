import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

type Heading = { text: string; level: number; raw: string };

type GetMarkedOption = {
  onParseHeading(heading: Heading): void;
};

function getMarked(option: GetMarkedOption) {
  const { onParseHeading } = option;
  return new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
    {
      renderer: {
        heading(text: string, level: number, raw: string): string {
          const encodedText = encodeURIComponent(text);
          onParseHeading({ level, text, raw });
          return `<h${level} id="${encodedText}" data-heading>${text}</h${level}>`;
        },
      },
    },
  );
}

export type HeadingWithChildren = Heading & {
  children: HeadingWithChildren[];
  empty?: true;
};

class MarkdownParser {
  marked: Marked;
  headings: Heading[] = [];
  constructor() {
    this.marked = getMarked({ onParseHeading: this.onParseHeading.bind(this) });
  }
  parse(text: string) {
    const html = this.marked.parse(text);
    const headings = this.normalizeHeading(this.headings);
    return { html, headings };
  }

  private normalizeHeading(headings: Heading[]) {
    const result: HeadingWithChildren[] = [];
    const stack: HeadingWithChildren[] = [];
    for (const heading of headings) {
      const { level, text, raw } = heading;
      let prev: HeadingWithChildren | null = stack.length
        ? stack[stack.length - 1]
        : null;
      while (prev && prev.level >= level) {
        stack.pop();
        prev = stack.length ? stack[stack.length - 1] : null;
      }

      if (level === 1) {
        const top: HeadingWithChildren = {
          text,
          level: 1,
          raw,
          children: [],
        };
        result.push(top);
        stack.push(top);
        continue;
      }

      if (!prev && level !== 1) {
        const top: HeadingWithChildren = {
          text: "",
          level: 1,
          raw: "",
          empty: true,
          children: [],
        };
        result.push(top);
        stack.push(top);
        prev = top;
      }

      if (prev) {
        let _level = prev.level + 1;
        while (_level < level) {
          const curr: HeadingWithChildren = {
            text: "",
            level: _level++,
            raw: "",
            empty: true,
            children: [],
          };
          stack[stack.length - 1].children.push(curr);
          stack.push(curr);
        }
        const curr: HeadingWithChildren = {
          text,
          level,
          raw,
          children: [],
        };
        stack[stack.length - 1].children.push(curr);
        stack.push(curr);
      }
    }
    return result;
  }
  private onParseHeading(heading: Heading) {
    this.headings.push(heading);
  }
}

export default MarkdownParser;
