import { useEffect, useMemo, useRef } from "react";
import classNames from "classnames";
import MarkdownParser, { HeadingWithChildren } from "@/utils/marked";
import debounce from "@/utils/debounce";
import "@/assets/styles/markdown.css";

interface MarkdownProps {
  text: string | undefined;
  onUpdateTableOfContents?: (contents: HeadingWithChildren[]) => void;
  onSetActiveHeading?: (headingId?: string) => void;
  className?: string;
}

function Markdown(props: MarkdownProps) {
  const { text, onUpdateTableOfContents, className, onSetActiveHeading } =
    props;
  const containerRef = useRef<HTMLDivElement>(null);
  const headingElsRef = useRef<HTMLHeadElement[]>([]);
  const headingOffsetRef = useRef<number[]>([]);

  const result = useMemo(() => {
    const parser = new MarkdownParser();
    return parser.parse(text || "");
  }, [text]);

  useEffect(() => {
    onUpdateTableOfContents?.(result.headings);
  }, [result]);

  useEffect(() => {
    if (containerRef.current) {
      const headings: NodeListOf<HTMLHeadElement> =
        containerRef.current.querySelectorAll("[data-heading]");
      headingElsRef.current = Array.from(headings);
      let top = 0;
      let target: HTMLElement | null = containerRef.current;
      while (target) {
        top += target.offsetTop;
        target = target.offsetParent as HTMLElement;
      }
      const offset: number[] = [];
      headings.forEach((el) => offset.push(el.offsetTop + top));
      headingOffsetRef.current = offset;
    }
  }, [result.html]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(function () {
      const scrollY = window.scrollY + 60;
      const offsets = headingOffsetRef.current;
      if (scrollY < offsets[0]) {
        onSetActiveHeading?.(undefined);
        return;
      }
      const headings = headingElsRef.current;
      const len = offsets.length;
      let i = 0;
      while (i < len) {
        if (scrollY < offsets[i]) {
          break;
        }
        i++;
      }

      onSetActiveHeading?.(
        decodeURIComponent(
          scrollY === offsets[i] ? headings[i].id : headings[i - 1].id,
        ),
      );
    }, 30);
    document.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      document.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

  return (
    <div
      className={classNames("markdown-body relative", className)}
      dangerouslySetInnerHTML={{ __html: result.html }}
      ref={containerRef}
    ></div>
  );
}

export default Markdown;
