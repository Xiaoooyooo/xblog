import classNames from "classnames";
import { useCallback, ReactNode } from "react";

export type MenuItem = {
  disabled?: boolean;
  onClick: () => void;
  icon?: ReactNode;
  label: string;
};

export default function MenuItem(props: MenuItem) {
  const { disabled, onClick, icon, label } = props;
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    onClick();
  }, [disabled, onClick]);
  return (
    <div
      onClick={handleClick}
      className={classNames(
        "w-40 flex cursor-pointer",
        disabled ? "text-slate-400" : "hover:bg-gray-300",
      )}
    >
      <div className="basis-8">{icon}</div>
      <div className="flex-auto">{label}</div>
    </div>
  );
}
