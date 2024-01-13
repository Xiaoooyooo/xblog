import { useMemo, forwardRef, PropsWithChildren, MouseEvent } from "react";
import classNames from "classnames";
import LoadingIcon from "@/assets/icons/circle-loading.svg";

type ButtonProps = PropsWithChildren<{
  type?: "primary" | "text";
  htmlType?: "button" | "submit";
  className?: string;
  loading?: boolean;
  onClick?: (e: MouseEvent) => void;
}>;
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const {
      children,
      type = "primary",
      htmlType,
      onClick,
      className,
      loading,
    } = props;

    const handleClick = useMemo(() => {
      if (!onClick) return undefined;
      return (e: MouseEvent) => {
        if (loading) return;
        onClick(e);
      };
    }, [loading, onClick]);

    return (
      <button
        type={htmlType}
        className={classNames(
          "border-none bg-none outline-none",
          "py-2 px-4",
          "cursor-pointer rounded",
          "flex justify-center items-center",
          type === "primary" && [
            "bg-[--button-primary-background-color] text-[--button-primary-text-color]",
            "transition-all duration-300",
            "hover:bg-[--button-primary-hover-background-color]",
            "active:bg-[--button-primary-active-background-color]",
            loading && "bg-[--button-primary-disabled-background-color]",
          ],
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
