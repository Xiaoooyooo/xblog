import React from "react";

import { Content, ContentBackground } from "layouts";
import Pane from "components/Pane";
import BlogList from "components/Blogs/BlogList";
import Pagination from "components/Pagination";
import styles from "./Home.module.scss";

type HomeProps = React.ComponentProps<"div">;
type HomeState = {
  blogs: Blog[];
};

class HomeScence extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      blogs: [
        {
          title: "test测试",
          text: "asdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-01T14:05:31.000Z",
          url: "/blog/one",
        },
        {
          title: "test",
          text: "asdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-05T14:05:31.000Z",
          url: "/blog/two",
        },
        {
          title: "test",
          text: "asdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-06T04:05:31.000Z",
          url: "/blog/three",
        },
        {
          title: "test",
          text: "asdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-09T14:05:31.000Z",
          url: "/blog/four",
        }
      ]
    };
  }
  componentDidUpdate() {
    console.log("Home Updated!");
  }
  componentDidMount() {
    // console.log(this.props);
  }
  render() {
    const { blogs } = this.state;
    return (
      <Content className={styles.home}>
        <ContentBackground className={styles.background} />
        <Pane className={styles.content}>
          <BlogList blogs={blogs} />
        </Pane>
        <Pagination total={200} pageSize={6} />
      </Content>
    );
  }
}

export default HomeScence;
