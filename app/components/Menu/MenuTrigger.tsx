import classNames from "classnames";
import { PropsWithChildren, useCallback, MouseEventHandler } from "react";
import { useMenuContext } from "./context";
import { MenuItem } from "./MenuItem";

type MenuTriggerProps = PropsWithChildren<{
  className?: string;
  menus: MenuItem[];
}>;

export default function MenuTrigger(props: MenuTriggerProps) {
  const { children, className, menus } = props;
  const { setMenu, setTriggerRect } = useMenuContext();
  const handleClick: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      setMenu(menus);
      const target = (e.target as HTMLElement).closest(".menu-trigger");
      if (target) {
        setTriggerRect(target.getBoundingClientRect());
      }
    },
    [menus],
  );

  return (
    <div
      onClick={handleClick}
      className={classNames("menu-trigger", className)}
    >
      {children}
    </div>
  );
}
