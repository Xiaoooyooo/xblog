import {
  useState,
  useMemo,
  memo,
  useRef,
  useLayoutEffect,
  useEffect,
  PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { useMenuContext } from "./context";
import { Transition } from "../Transition";
// import { MenuItem } from "./MenuItem";
import "./closeEvent";
import domOffset from "@/utils/domOffset";

type MenuProps = PropsWithChildren<{
  show: boolean;
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
}>;

export default function Menu(props: MenuProps) {
  return createPortal(<MenuContent {...props} />, document.body);
}

function MenuContent(props: MenuProps) {
  const { show, children, onClose, anchorEl } = props;
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const menuElRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (show && menuElRef.current && anchorEl) {
      const { clientHeight, clientWidth } = menuElRef.current;
      const { clientHeight: CH, clientWidth: CW } = document.body;
      const { clientHeight: AH, clientWidth: AW } = anchorEl;
      const { left, top } = domOffset(anchorEl);
      const right = left + AW,
        bottom = top + AH;
      if (right + clientWidth <= CW && bottom + clientHeight <= CH) {
        setPosition({ top: bottom, left });
      } else if (right - clientWidth >= 0 && bottom + clientHeight <= CH) {
        setPosition({ top: bottom, left: right - clientWidth });
      }
      // todo: other position
    }
  }, [show, anchorEl]);

  return (
    <Transition
      show={show}
      duration={200}
      beforeEnterClassName="opacity-0 scale-y-75"
      enterActiveClassName="transition-all duration-200"
      leaveActiveClassName="transition-all duration-200"
      leaveDoneClassName="opacity-0 scale-y-75"
      unmountOnHide
      ref={menuElRef}
    >
      <div
        style={{ left: position.left, top: position.top }}
        className={classNames(
          "menu",
          "origin-top",
          "absolute z-[9999] shadow-lg bg-[--menu-background-color] rounded-md py-2",
          "text-[--menu-text-color]",
        )}
      >
        {children}
      </div>
    </Transition>
  );
}
