import React from "react";

import Loading from "./Loading";
import styles from "./Pane.module.scss";
type PaneProps = React.ComponentProps<"div"> & {
  loading?: boolean;
};

function Pane(props: PaneProps) {
  const { loading, className, children, ...rest } = props;
  const classes = `${className} ${styles.pane}`;
  return (
    <div className={classes} {...rest}>
      {loading && <Loading />}
      {children}
    </div>
  );
}

export default Pane;
