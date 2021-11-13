import React from "react";

import styles from "./Pane.module.scss";
type PaneProps = React.ComponentProps<"div">;

class Pane extends React.Component<PaneProps> {
  render() {
    const { className, children, ...rest } = this.props;
    const classes = `${className} ${styles.pane}`;
    return (
      <div className={classes} {...rest}>{children}</div>
    );
  }
}

export default Pane;
