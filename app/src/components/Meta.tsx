import React from "react";

type MetaProps = React.ComponentProps<"span">;

import styles from "./Meta.module.scss";

function Meta(props: MetaProps) {
  const { children, className, onClick, ...rest } = props;
  const classes = `${styles.meta} ${className}`;
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      e.preventDefault();
      console.log(e);
      onClick && onClick(e);
    }, [onClick]
  );
  return (
    <span onClick={handleClick} className={classes} {...rest}>{children}</span>
  );
}

export default Meta;
