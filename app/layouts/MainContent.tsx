import { PropsWithChildren } from "react";

import styles from "./MainContent.module.scss";

type ContentBackgroundProps = {
  className: string;
};

export function ContentBackground(props: ContentBackgroundProps) {
  const { className, ...rest } = props;
  const classes = `${styles.background} ${className}`;
  return (
    <div className={classes} {...rest}>
      {/* TODO: 文字说明 */}
    </div>
  );
}

type MainContentProps = PropsWithChildren & { className: string };
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
