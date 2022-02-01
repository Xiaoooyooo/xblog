import React from "react";

import request from "utils/request";
import withRouter, { WithRouterProps } from "HOC/withRouter";
import { Content, ContentBackground } from "layouts";
import Pane from "components/Pane";
import BlogList from "components/Blogs/BlogList";
import Pagination from "components/Pagination";
import styles from "./Home.module.scss";

type HomeProps = React.ComponentProps<"div">
  & WithRouterProps<{ page: string }>;
type HomeState = {
  loading: boolean;
  blogs: Blog[];
  pageSize: number;
};

class HomeScence extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      loading: true,
      blogs: [
        {
          id: "1",
          title: "test测试",
          text: "asdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-01T14:05:31.000Z",
          url: "/blog/one",
        },
        {
          id: "2",
          title: "test",
          text: "asdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-05T14:05:31.000Z",
          url: "/blog/two",
        },
        {
          id: "3",
          title: "test",
          text: "asdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-06T04:05:31.000Z",
          url: "/blog/three",
        },
        {
          id: "4",
          title: "test",
          text: "asdasdasdasdasdasdasdasdasdasdas",
          category: "AAA",
          tags: ["aaa", "bbb"],
          createdAt: "2021-11-09T14:05:31.000Z",
          url: "/blog/four",
        }
      ],
      pageSize: 6,
    };
  }
  fetchBlogList = (page: number) => {
    const { loading } = this.state;
    if (!loading) {
      this.setState({ loading: true });
    }
    request.post("blog.list", {
      data: {
        page,
      }
    })
      .then((res: XhrResponse) => {
        console.log(res);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  handlePageChange(currentPage: number, pageSize: number) {
    console.log("pagination:", currentPage, pageSize);
  }
  componentDidUpdate(prevProps: HomeProps, prevState: HomeState) {
    console.log("Home Updated!", prevProps, prevState);
    const currentPage = this.props.params.page;
    if (prevProps.params.page !== currentPage) {
      this.fetchBlogList(Number(currentPage) || 1);
    }
  }
  componentDidMount() {
    const { params: { page } } = this.props;
    const currentPage = Number(page) || 1;
    this.fetchBlogList(currentPage);
  }
  render() {
    const { blogs, loading } = this.state;
    return (
      <Content className={styles.home}>
        <ContentBackground className={styles.background} />
        <Pane className={styles.content} loading={loading}>
          <BlogList blogs={blogs} />
        </Pane>
        <Pagination
          total={200}
          pageSize={6}
          onPageChange={this.handlePageChange}
        />
      </Content>
    );
  }
}

export default withRouter(HomeScence);
