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
        "h-[50px] w-[50px] rounded-full shadow-lg mb-3 cursor-pointer",
        className,
      )}
    >
      <Tooltip
        tip={tip}
        className="h-full w-full flex justify-center items-center"
        unmountTipOnHide
        placement="left"
        // mountOnBody
      >
        <button className="pointer-events-none">
          {typeof element === "function" ? element(isActionPending) : element}
        </button>
      </Tooltip>
    </div>
  );
});
