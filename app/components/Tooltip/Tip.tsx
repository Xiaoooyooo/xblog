import { PropsWithChildren, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Transition } from "../Transition";
import classNames from "classnames";

type TipProps = PropsWithChildren<{
  show: boolean;
  mountOnBody?: boolean;
  unmountOnHide?: boolean;
  className?: string;
  position: { left: number; top: number };
  placement: "top" | "bottom" | "left" | "right";
}>;

export default forwardRef<HTMLDivElement, TipProps>(function Tip(props, ref) {
  const {
    show,
    children,
    mountOnBody,
    unmountOnHide,
    className,
    position,
    placement,
  } = props;

  const content = (
    <Transition
      show={show}
      duration={200}
      beforeEnterClassName="opacity-0"
      enterActiveClassName="transition-all duration-200"
      leaveActiveClassName="transition-all duration-200"
      leaveDoneClassName="opacity-0"
      unmountOnHide={unmountOnHide}
      ref={ref}
    >
      <div className={classNames("p-2", className)} style={{ ...position }}>
        <div
          className={classNames(
            "w-max relative py-1 px-2 rounded shadow-md",
            "border border-[--tooltip-border-color]",
            "bg-[--tooltip-background-color] text-[--tooltip-text-color]",
          )}
        >
          {children}
          <i
            className={classNames(
              "block absolute h-2 w-2 rotate-45 bg-[--tooltip-background-color] border-[--tooltip-border-color]",
              placement === "top" &&
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b border-r",
              placement === "left" &&
                "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-t border-r",
              placement === "bottom" &&
                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t",
              placement === "right" &&
                "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-b border-l",
            )}
          ></i>
        </div>
      </div>
    </Transition>
  );

  if (mountOnBody) {
    return createPortal(content, document.body);
  }
  return content;
});
