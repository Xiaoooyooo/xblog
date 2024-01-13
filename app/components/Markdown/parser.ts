import "./CodeAction/action";
import getMarked from "@/utils/marked";

type Heading = { text: string; level: number; raw: string };

export type HeadingWithChildren = Heading & {
  children: HeadingWithChildren[];
  empty?: true;
};

export default class MarkdownParser {
  marked: ReturnType<typeof getMarked>;
  headings: Heading[] = [];
  constructor() {
    this.marked = getMarked({
      renderer: {
        heading: (text: string, level: number, raw: string) => {
          const encodedText = encodeURIComponent(text);
          this.headings.push({ level, text, raw });
          return `<h${level} id="${encodedText}" data-heading>${text}</h${level}>`;
        },
        code(code, infostring, escaped) {
          return (
            "<pre style='position: relative'>" +
            `<code-action data-lan='${infostring}'></code-action>` +
            "<code class='hljs language-" +
            infostring +
            "'>" +
            code +
            "</code></pre>"
          );
        },
      },
    });
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
}
