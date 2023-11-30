import { PropsWithChildren } from "react";
import { useListContext } from "./ListContext";
import classNames from "classnames";

type ListItemProps = PropsWithChildren<{
  className?: string;
}>;

export default function ListItem(props: ListItemProps) {
  const { children, className } = props;
  const { handleItemMouseEnter, handleItemMouseLeave } = useListContext();
  return (
    <div
      onMouseEnter={handleItemMouseEnter}
      onMouseLeave={handleItemMouseLeave}
      className={classNames(
        "x-list-item relative z-20 cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
