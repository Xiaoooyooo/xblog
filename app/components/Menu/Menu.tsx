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

type MenuProps = PropsWithChildren<{
  show: boolean;
  anchor?: DOMRect;
  onClose?: () => void;
}>;

export default function Menu(props: MenuProps) {
  return createPortal(<MenuContent {...props} />, document.body);
}

function MenuContent(props: MenuProps) {
  const { show, children, onClose, anchor } = props;
  // const { isOpen, menus, triggerRect, closeMenu } = useMenuContext();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const menuElRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // console.log({ anchor });
    // console.log(menuElRef.current);

    if (show && menuElRef.current && anchor) {
      const { clientHeight, clientWidth } = menuElRef.current;
      const { top, left, right, bottom, height, width } = anchor;
      const { clientHeight: CH, clientWidth: CW } = document.body;
      if (right + clientWidth <= CW && bottom + clientHeight <= CH) {
        setPosition({ top: bottom, left });
      }
    }
  }, [show, anchor]);

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
          "absolute z-[9999] shadow-lg bg-white rounded-md py-2",
        )}
      >
        {children}
      </div>
    </Transition>
  );
}
