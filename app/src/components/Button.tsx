import React, { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ComponentPropsWithoutRef<"button">;
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const { className, ...rest } = props;
    return (
      <button
        onClick={props.onClick}
        className={`${styles.btnDefault} ${className}`}
        {...rest}
        ref={ref}
      >
        {props.children}
      </button>
    );
  });

Button.displayName = "Button";

export default Button;