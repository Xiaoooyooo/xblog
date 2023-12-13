import { PropsWithChildren } from "react";
import DeleteIcon from "@/assets/icons/delete.svg";

type TagProps = PropsWithChildren<{
  deletable?: boolean;
  onDelete?: () => void;
}>;

export default function Tag(props: TagProps) {
  const { children, deletable, onDelete } = props;

  return (
    <div className="inline-block mr-1 border bg-[--tag-background-color] border-[--tag-border-color] rounded-sm">
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
