import { useMemo, forwardRef, PropsWithChildren, MouseEvent } from "react";
import classNames from "classnames";
import LoadingIcon from "@/assets/icons/circle-loading.svg";

type ButtonProps = PropsWithChildren & {
  type?: "button" | "submit";
  className?: string;
  loading?: boolean;
  onClick?: (e: MouseEvent) => void;
};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const { children, type, onClick, className, loading } = props;

    const handleClick = useMemo(() => {
      if (!onClick) return undefined;
      return (e: MouseEvent) => {
        if (loading) return;
        onClick(e);
      };
    }, [loading, onClick]);

    return (
      <button
        type={type}
        className={classNames(
          "border-none bg-none outline-none",
          "py-2 px-4",
          "cursor-pointer",
          "rounded",
          "bg-blue-500",
          "text-white",
          "transition-all duration-300",
          "hover:bg-blue-400",
          "active:bg-blue-300",
          "flex",
          "justify-center",
          "items-center",
          loading && ["bg-blue-400"],
          className,
        )}
        onClick={handleClick}
        ref={ref}
      >
        {loading && <LoadingIcon height="20" width="20" className="mr-2" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
