import classNames from "classnames";
import {
  useState,
  useCallback,
  ReactNode,
  PropsWithChildren,
  MouseEventHandler,
} from "react";

export type MenuItemProps = PropsWithChildren<{
  disabled?: boolean;
  onClick: (option: { close: () => void }) => void | boolean;
  icon?: ReactNode;
}>;

export function MenuItem(props: MenuItemProps) {
  const { disabled, onClick, icon, children } = props;
  // const [state, setState] = useState(initialState);

  const handleClick: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (disabled) {
        return;
      }
      const isClose = onClick({ close: () => {} });
      if (typeof isClose === "boolean" && !isClose) {
        return;
      }
      // closeMenu();
    },
    [disabled, onClick],
  );

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "w-40 flex cursor-pointer",
        disabled
          ? "text-[--menu-item-disabled-background-color]"
          : "hover:bg-[--menu-item-hover-background-color]",
      )}
    >
      <div className="basis-8 flex justify-center items-center">{icon}</div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}

export function Separator() {
  return <div className="h-[1px] bg-slate-400 my-2"></div>;
}
