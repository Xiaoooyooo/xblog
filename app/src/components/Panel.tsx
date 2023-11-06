import React, { PropsWithChildren } from "react";
import classNames from "classnames";

type PanelProps = PropsWithChildren & {
  shadow?: boolean;
  rounded?: boolean;
};

function Panel(props: PanelProps) {
  const { children, shadow, rounded } = props;
  return (
    <div
      className={classNames(
        "p-8",
        "relative",
        "bg-white",
        shadow && "shadow-xl",
        rounded && "rounded-lg",
      )}
    >
      {children}
    </div>
  );
}

export default Panel;
