import React, { ComponentPropsWithoutRef } from "react";

import styles from "./Input.module.scss";
type InputProps = ComponentPropsWithoutRef<"input">;
const Input =
  React.forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
    const { className = "", ...rest } = props;
    return (
      <input className={`${styles.input} ${className}`} {...rest} ref={ref} />
    );
  });

Input.displayName = "Input";

export default Input;