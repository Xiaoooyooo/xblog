import classNames from "classnames";
import {
  useState,
  useRef,
  useEffect,
  PropsWithChildren,
  useCallback,
  MouseEventHandler,
  ReactElement,
} from "react";
import Menu from "./Menu";
import { addEvents, removeEvents } from "./closeEvent";

type MenuTriggerProps = PropsWithChildren<{
  className?: string;
  menu: ReactElement;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onMenuClosed?: () => void;
}>;

export default function MenuTrigger(props: MenuTriggerProps) {
  const { children, className, menu, onMenuOpen, onMenuClose, onMenuClosed } =
    props;
  const [isShow, setIsShow] = useState(false);
  const triggerElRef = useRef<HTMLDivElement>(null);
  const handleClick: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsShow(true);
  }, []);

  useEffect(() => {
    if (isShow) {
      onMenuOpen?.();
    } else {
      onMenuClose?.();
    }
  }, [isShow]);

  useEffect(() => {
    function h() {
      setIsShow(false);
    }
    addEvents(h);
    return () => removeEvents(h);
  }, []);

  return (
    <>
      <div
        onClick={handleClick}
        className={classNames("menu-trigger", className)}
        ref={triggerElRef}
      >
        {children}
      </div>
      <Menu
        show={isShow}
        anchorEl={triggerElRef.current}
        onClosed={onMenuClosed}
      >
        {menu}
      </Menu>
    </>
  );
}
