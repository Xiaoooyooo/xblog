import React, { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ComponentPropsWithoutRef<"button">;
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const { className, children, ...rest } = props;
    const classes = `${styles.btnDefault} ${className}`;
    return (
      <button
        className={classes}
        {...rest}
        ref={ref}
      >
        {children}
      </button>
    );
  });

Button.displayName = "Button";

export default Button;