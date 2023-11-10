import { MouseEvent, PropsWithChildren, useCallback } from "react";

type MetaProps = PropsWithChildren & {
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

import styles from "./Meta.module.scss";

function Meta(props: MetaProps) {
  const { children, className, onClick, ...rest } = props;
  const classes = `${styles.meta} ${className}`;
  const handleClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      console.log(e);
      onClick && onClick(e);
    },
    [onClick],
  );
  return (
    <span onClick={handleClick} className={classes} {...rest}>
      {children}
    </span>
  );
}

export default Meta;
