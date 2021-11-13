import React, { ReactNode } from "react";

import Header from "views/components/Header";
import Footer from "views/components/Footer";
import styles from "./BaseLayout.module.scss";

type LayoutProps = React.ComponentProps<"main">;

export default class BaseLayout extends React.Component<LayoutProps> {
  render(): ReactNode {
    const { children } = this.props;
    return (
      <>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </>
    );
  }
}