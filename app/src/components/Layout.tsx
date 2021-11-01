import React, { ComponentProps, ReactNode } from "react";

import styles from "./Layout.module.scss";


type Props = ComponentProps<"div">;
export default class Layout extends React.Component<Props> {

  render(): ReactNode {
    const { className = "", children, ...rest } = this.props;
    return (
      <div className={`${styles.layout} ${className}`} {...rest}>
        {children}
      </div>
    );
  }
}