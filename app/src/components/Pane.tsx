import React from "react";

import Loading from "./Loading";
import styles from "./Pane.module.scss";
type PaneProps = React.ComponentProps<"div"> & {
  loading?: boolean;
};

class Pane extends React.Component<PaneProps> {
  render() {
    const { loading, className, children, ...rest } = this.props;
    const classes = `${className} ${styles.pane}`;
    return (
      <div className={classes} {...rest}>
        {loading && <Loading />}
        {children}
      </div>
    );
  }
}

export default Pane;
