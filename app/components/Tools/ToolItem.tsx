import classNames from "classnames";
import { memo, useState } from "react";
import Tooltip from "../Tooltip";

type ToolItemProps = {
  element: JSX.Element | ((isActionPending: boolean) => JSX.Element);
  onClick: (
    isActionPending: boolean,
    setIsActionPending: (value: boolean) => void,
  ) => void;
  className?: string;
  tip: string;
};

export default memo(function ToolItem(props: ToolItemProps) {
  const { element, onClick, className, tip } = props;
  const [isActionPending, setIsActionPending] = useState(false);
  return (
    <div
      onClick={() => onClick(isActionPending, setIsActionPending)}
      className={classNames(
        "h-9 w-9 md:h-[50px] md:w-[50px]",
        "bg-[--background-color] rounded-full shadow-lg mb-3 cursor-pointer",
        className,
      )}
    >
      <div className="flex h-full w-full justify-center items-center md:hidden">
        <button className="pointer-events-none">
          {typeof element === "function" ? element(isActionPending) : element}
        </button>
      </div>
      <Tooltip
        tip={tip}
        className="hidden md:flex h-full w-full justify-center items-center"
        unmountTipOnHide
        placement="left"
      >
        <button className="pointer-events-none">
          {typeof element === "function" ? element(isActionPending) : element}
        </button>
      </Tooltip>
    </div>
  );
});
