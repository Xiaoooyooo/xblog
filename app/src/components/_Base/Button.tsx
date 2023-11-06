import { forwardRef, PropsWithChildren, MouseEvent } from "react";
import classNames from "classnames";

type ButtonProps = PropsWithChildren & {
  className?: string;
  onClick?: (e: MouseEvent) => void;
};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const { children, onClick, className } = props;
    return (
      <button
        className={classNames(
          "border-none bg-none outline-none",
          "py-2 px-4",
          "cursor-pointer",
          "transition-all duration-300",
          "rounded",
          className,
        )}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
