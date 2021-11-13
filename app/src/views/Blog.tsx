import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { Content, ContentBackground } from "layouts";
import Pane from "components/Pane";
import styles from "./Blog.module.scss";

interface BlogParams {
  blogName: string;
}
type BlogScenceProps = React.ComponentProps<"div"> &
RouteComponentProps<BlogParams>;

class BlogScence extends React.Component<BlogScenceProps> {
  render() {
    const { match: { params } } = this.props;
    return (
      <Content className={styles.blogScence}>
        <ContentBackground className={styles.blogBackground} />
        <Pane className={styles.mainContent}>
          
        </Pane>
      </Content>
    );
  }
}

export default withRouter(BlogScence);
