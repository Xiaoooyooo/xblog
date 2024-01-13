import { PropsWithChildren } from "react";
import classNames from "classnames";
import DeleteIcon from "@/assets/icons/delete.svg";

type TagProps = PropsWithChildren<{
  deletable?: boolean;
  onDelete?: () => void;
  className?: string;
}>;

export default function Tag(props: TagProps) {
  const { children, deletable, onDelete, className } = props;

  return (
    <div
      className={classNames(
        "bg-[--tag-background-color] border-[--tag-border-color]",
        "inline-block mr-1 border rounded-sm",
        className,
      )}
    >
      <div className="flex justify-center items-center">
        <span className="px-1">{children}</span>
        {deletable && (
          <span onClick={onDelete}>
            <DeleteIcon height={18} width={18} />
          </span>
        )}
      </div>
    </div>
  );
}
