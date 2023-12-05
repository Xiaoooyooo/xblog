import {
  useState,
  useMemo,
  memo,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { useMenuContext } from "./context";
import { Transition } from "../Transition";
import MenuItem from "./MenuItem";

export default function Menu() {
  return createPortal(<MenuContent />, document.body);
}

const MenuContent = memo(function MenuContent() {
  const { isOpen, menus, triggerRect, closeMenu } = useMenuContext();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const menuElRef = useRef<HTMLDivElement>(null);
  console.log({ menus });
  const content = useMemo(() => {
    return menus.map((item) => <MenuItem key={item.label} {...item} />);
  }, [menus]);

  useLayoutEffect(() => {
    if (menuElRef.current && triggerRect) {
      const { clientHeight, clientWidth } = menuElRef.current;
      const { top, left, right, bottom, height, width } = triggerRect;
      const { clientHeight: CH, clientWidth: CW } = document.body;
      console.log({ clientHeight, clientWidth, triggerRect });
      if (right + clientWidth <= CW && bottom + clientHeight <= CH) {
        setPosition({ top: bottom, left });
      }
    }
  }, [content]);

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest(".menu")) {
        return;
      }
      closeMenu();
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <Transition
      show={isOpen}
      duration={200}
      beforeEnterClassName="opacity-0 scale-y-75"
      enterActiveClassName="transition-all duration-200"
      leaveActiveClassName="transition-all duration-200"
      leaveDoneClassName="opacity-0 scale-y-75"
    >
      <div
        style={{ left: position.left, top: position.top }}
        className={classNames(
          "menu",
          "origin-top",
          "absolute z-[9999] shadow-lg bg-white rounded-md py-2",
        )}
        ref={menuElRef}
      >
        {content}
      </div>
    </Transition>
  );
});
