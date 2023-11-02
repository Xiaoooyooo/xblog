import React from "react";

import styles from "./MainContent.module.scss";

type MainContentProps = React.ComponentProps<"div">;
type ContentBackgroundProps = React.ComponentProps<"div">;

export function ContentBackground(props: ContentBackgroundProps) {
  const { className, ...rest } = props;
  const classes = `${styles.background} ${className}`;
  return (
    <div className={classes} {...rest}>
      {/* TODO: 文字说明 */}
    </div>
  );
}

function MainContent(props: MainContentProps) {
  const { children, className, ...rest } = props;
  const classes = `${className} ${styles.mainContent}`;
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default MainContent;
