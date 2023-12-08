import {
  PropsWithChildren,
  ReactNode,
  useMemo,
  useRef,
  useState,
  createElement,
  ReactElement,
  useLayoutEffect,
} from "react";
import Tip from "./Tip";
import classNames from "classnames";

type TooptipProps = PropsWithChildren<{
  trigger?: "click" | "hover";
  placement?: "top" | "bottom" | "left" | "right";
  tip: ReactNode;
  mountOnBody?: boolean;
  unmountTipOnHide?: boolean;
  className?: string;
  delay?: number;
}>;

export default function Tooltip(props: TooptipProps) {
  const {
    children,
    trigger = "hover",
    placement = "top",
    tip,
    mountOnBody,
    unmountTipOnHide,
    className,
    delay = 300,
  } = props;
  const [isShow, setIsShow] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const tipElRef = useRef<HTMLDivElement>(null);
  const [tipPosition, setTipPosition] = useState({ left: 0, top: 0 });

  const actions = useMemo(() => {
    if (trigger === "click") {
      return {
        onClick: function () {
          setIsShow((p) => !p);
        },
      };
    } else if (trigger === "hover") {
      let hoverTimer: ReturnType<typeof setTimeout> | undefined;
      const clearHoverTimer = function () {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = undefined;
        }
      };
      const setHoverTimer = function (isShow: boolean) {
        hoverTimer = setTimeout(() => {
          setIsShow(isShow);
        }, delay);
      };
      return {
        onMouseEnter: function () {
          clearHoverTimer();
          setHoverTimer(true);
        },
        onMouseLeave: function () {
          clearHoverTimer();
          setHoverTimer(false);
        },
      };
    }
  }, [trigger, delay]);

  useLayoutEffect(() => {
    if (isShow) {
      const el = elRef.current!;
      const tipEl = tipElRef.current!;
      let top = 0,
        left = 0;
      const { clientHeight: h, clientWidth: w } = el;
      const { clientHeight: tH, clientWidth: tW } = tipEl;
      if (mountOnBody) {
        let target = el as HTMLElement;
        while (target && target.offsetParent !== document.body) {
          top += target.offsetTop;
          left += target.offsetLeft;
          target = target.offsetParent as HTMLElement;
        }
      }
      switch (placement) {
        case "top":
          top -= tH;
          left -= (tW - w) / 2;
          break;
        case "bottom":
          top += h;
          left -= (tW - w) / 2;
          break;
        case "left":
          top -= (tH - h) / 2;
          left -= tW;
          break;
        case "right":
          top -= (tH - h) / 2;
          left += w;
      }
      setTipPosition({ top, left });
    }
  }, [isShow, mountOnBody]);

  return (
    <div {...actions} className={classNames("relative", className)} ref={elRef}>
      {children}
      <Tip
        show={isShow}
        mountOnBody={mountOnBody}
        unmountOnHide={unmountTipOnHide}
        className={classNames("absolute")}
        position={tipPosition}
        placement={placement}
        ref={tipElRef}
      >
        {tip}
      </Tip>
    </div>
  );
}
