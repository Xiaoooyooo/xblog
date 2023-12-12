import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from "react";
import { HeadingWithChildren } from "@/utils/marked";
import classNames from "classnames";

const TableOfContentsContext = createContext<{
  activeHeading: string | undefined;
}>({
  activeHeading: undefined,
});

function useTableOfContentsContext() {
  return useContext(TableOfContentsContext);
}

type TableOfContentsProps = {
  contents: HeadingWithChildren[];
  activeHeading?: string;
};

export default function TableOfContents(props: TableOfContentsProps) {
  const { activeHeading } = props;
  const containerElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.target instanceof HTMLAnchorElement) {
        e.preventDefault();
        const href = e.target.href;
        const hash = new URL(href).hash;
        handleScroll(hash);
      }
    }
    if (containerElRef.current) {
      containerElRef.current.addEventListener("click", handleClick);
    }
  }, []);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      handleScroll(hash);
    }
  }, [props.contents]);

  return (
    <TableOfContentsContext.Provider value={{ activeHeading }}>
      <Contents {...props} ref={containerElRef} />
    </TableOfContentsContext.Provider>
  );
}

const Contents = forwardRef<HTMLDivElement, TableOfContentsProps>(
  function Contents(props, ref) {
    const { contents } = props;
    return (
      <div className="text-slate-700" ref={ref}>
        {contents.length === 0 ? (
          <div>no content</div>
        ) : (
          <ul className="pl-2">
            {contents.map((item) => (
              <ContentItem
                key={item.text}
                text={item.text}
                level={item.level}
                raw={item.raw}
                empty={item.empty}
                descendants={item.children}
              />
            ))}
          </ul>
        )}
      </div>
    );
  },
);

type ContentItemProps = Omit<HeadingWithChildren, "children"> & {
  descendants: HeadingWithChildren[];
};

function ContentItem(props: ContentItemProps) {
  const { level, text, descendants, empty } = props;
  const { activeHeading } = useTableOfContentsContext();

  useEffect(() => {
    if (empty) {
      console.warn("wrong heading structure");
    }
  }, [empty]);

  return (
    <li>
      <div
        className={classNames(
          "max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap",
          "transition-colors duration-200",
          "hover:text-sky-500",
          activeHeading === text && "text-sky-500",
        )}
      >
        <a href={`#${encodeURIComponent(text)}`}>{text}</a>
      </div>
      {descendants.length > 0 && <Contents contents={descendants} />}
    </li>
  );
}

function computeTopOffset(element: HTMLElement) {
  let target: HTMLElement | null = element;
  let offset = 0;
  while (target) {
    offset += target.offsetTop;
    target = target.offsetParent as HTMLElement | null;
  }
  return offset;
}

function handleScroll(hash: string) {
  const headingElId = hash.replace(/^#/, "");
  const headingEl = document.getElementById(headingElId);
  if (headingEl) {
    // disable page scroll when setting location.hash
    headingEl.id = "";
    location.hash = hash;
    headingEl.id = headingElId;
    const top = computeTopOffset(headingEl) - 60;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
