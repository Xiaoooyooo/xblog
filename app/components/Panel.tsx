import React, { PropsWithChildren } from "react";
import classNames from "classnames";

type PanelProps = PropsWithChildren & {
  shadow?: boolean;
  rounded?: boolean;
  className?: string;
};

function Panel(props: PanelProps) {
  const { children, shadow, rounded, className } = props;
  return (
    <div
      className={classNames(
        "p-8",
        "relative",
        "bg-white",
        shadow && "shadow-xl",
        rounded && "rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Panel;
