import classNames from "classnames";
import { useState, useCallback, ReactNode } from "react";
import { useMenuContext } from "./context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseMenuItemProps<T = any> = {
  id: string;
  disabled?: boolean;
  onClick: (option: {
    state: T;
    setState: (state: T) => void;
    close: () => void;
  }) => void | boolean;
  icon?: ReactNode | ((state: T) => ReactNode);
  label: string | ((state: T) => string);
  state?: T;
};

type SeparatorMenuItemProps = {
  id: string;
  type: "separate";
};

export type MenuItem = BaseMenuItemProps | SeparatorMenuItemProps;

function SeparatorMenuItem() {
  return <div className="h-[1px] bg-slate-400 my-2"></div>;
}

function BaseMenuItem(props: BaseMenuItemProps) {
  const { disabled, onClick, icon, label, state: initialState = {} } = props;
  const { closeMenu } = useMenuContext();
  const [state, setState] = useState(initialState);

  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    const isClose = onClick({ state, setState, close: closeMenu });
    if (typeof isClose === "boolean" && !isClose) {
      return;
    }
    closeMenu();
  }, [disabled, onClick, state]);

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "w-40 flex cursor-pointer",
        disabled ? "text-slate-400" : "hover:bg-gray-300",
      )}
    >
      <div className="basis-8 flex justify-center items-center">
        {typeof icon === "function" ? icon(state) : icon}
      </div>
      <div className="flex-auto">
        {typeof label === "function" ? label(state) : label}
      </div>
    </div>
  );
}

export default function MenuItem(props: MenuItem) {
  if ("type" in props && props.type === "separate") {
    return <SeparatorMenuItem />;
  }
  return <BaseMenuItem {...(props as BaseMenuItemProps)} />;
}
