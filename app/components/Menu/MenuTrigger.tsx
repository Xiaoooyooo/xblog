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
import { MenuItem } from "./MenuItem";
import Menu from "./Menu";
import { addEvents, removeEvents } from "./closeEvent";

type MenuTriggerProps = PropsWithChildren<{
  className?: string;
  menu: ReactElement;
}>;

export default function MenuTrigger(props: MenuTriggerProps) {
  const { children, className, menu } = props;
  const [isShow, setIsShow] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect>();
  const triggerElRef = useRef<HTMLDivElement>(null);
  const handleClick: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsShow(true);
    setTriggerPosition(triggerElRef.current?.getBoundingClientRect());
  }, []);

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
      <Menu show={isShow} anchor={triggerPosition}>
        {menu}
      </Menu>
    </>
  );
}
