import { useRef, useCallback, useState } from "react";

import BlogItem from "./BlogItem";
import classNames from "classnames";

interface BlogListProps {
  blogs: Blog[];
}

function BlogList(props: BlogListProps) {
  const { blogs } = props;
  const [backgroundPosition, setBackgroundPosition] = useState({
    visible: false,
    y: 0,
    height: 0,
  });
  const hoverBackgroundElRef = useRef(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleItemMouseEnter = useCallback((target: HTMLDivElement) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    setBackgroundPosition({
      visible: true,
      y: target.offsetTop,
      height: target.clientHeight,
    });
  }, []);
  const handleItemMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setBackgroundPosition((p) => ({
        ...p,
        visible: false,
      }));
    }, 500);
  }, []);

  return (
    <div className={classNames("relative")}>
      {blogs.map((blog, i) => (
        <BlogItem
          key={i}
          blog={blog}
          onMouseEnter={handleItemMouseEnter}
          onMouseLeave={handleItemMouseLeave}
        />
      ))}
      <div
        className={classNames(
          "absolute",
          "top-0",
          "transition-all",
          "duration-300",
          "bg-gray-200",
          "w-full",
          "z-10",
          "rounded",
          "shadow-lg",
        )}
        style={{
          transform: `translateY(${backgroundPosition.y}px)`,
          height: backgroundPosition.height,
          opacity: backgroundPosition.visible ? 1 : 0,
        }}
        ref={hoverBackgroundElRef}
      ></div>
    </div>
  );
}

export default BlogList;
