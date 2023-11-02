import React from "react";
import {} from "react-router-dom";

import { Content, ContentBackground } from "@/layouts";
import styles from "./About.module.scss";

class AboutScence extends React.PureComponent {
  render() {
    return (
      <Content>
        <ContentBackground className={styles.aboutBackground} />
      </Content>
    );
  }
}

export default AboutScence;
