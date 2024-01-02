import {
  PropsWithChildren,
  useState,
  useRef,
  useCallback,
  MouseEvent,
} from "react";
import classNames from "classnames";
import ListContext from "./ListContext";

type ListProps = PropsWithChildren;

export default function List(props: ListProps) {
  const { children } = props;
  const [backgroundPosition, setBackgroundPosition] = useState({
    visible: false,
    y: 0,
    height: 0,
  });
  const hoverBackgroundElRef = useRef(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleItemMouseEnter = useCallback((event: MouseEvent) => {
    const target: HTMLDivElement | null = (event.target as HTMLElement).closest(
      ".x-list-item",
    );
    if (!target) {
      return;
    }
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
    <ListContext.Provider
      value={{ handleItemMouseEnter, handleItemMouseLeave }}
    >
      <div className="relative">
        {children}
        <div
          className={classNames(
            "hidden md:block",
            "absolute",
            "top-0",
            "transition-all",
            "duration-300",
            "bg-[--list-item-hover-background-color]",
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
    </ListContext.Provider>
  );
}
