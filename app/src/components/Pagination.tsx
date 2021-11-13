import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

import styles from "./Pagination.module.scss";

type PaginationProps = React.ComponentProps<"div">
  & RouteComponentProps<{ page: string }>
  & {
    total: number;
    pageSize: number;
    pageBtnNumber?: number;
    onPageChange?: () => void;
  };

type PaginationState = {
  pageIndex: number;
  maxPageCount: number;
}
class Pagination extends React.Component<PaginationProps, PaginationState> {
  constructor(props: PaginationProps) {
    super(props);
    this.state = {
      pageIndex: 1,
      maxPageCount: Math.ceil(props.total / props.pageSize),
    };
  }
  render() {
    const { maxPageCount } = this.state;
    const { match: { params: { page = 1 } }, pageBtnNumber = 7 } = this.props;
    const pageBtns = [];
    for (let i = 1; i <= maxPageCount; i++) {
      if (i === 1) {
        pageBtns.push(
          <PageBtn
            key={i}
            index={i}
            className={page == i ? styles.currentPage : ""}
            href={`/home/${i}`} />
        );
        continue;
      }
      if (i === maxPageCount) {
        pageBtns.push(
          <PageBtn
            key={i}
            index={i}
            className={Number(page) === i ? styles.currentPage : ""}
            href={`/home/${i}`} />
        );
        continue;
      }
      if (maxPageCount > pageBtnNumber) {
        if (
          i === Number(page) - 2 ||
          i === Number(page) - 1 ||
          i === Number(page) ||
          i === Number(page) + 1 ||
          i === Number(page) + 2
        ) {
          pageBtns.push(
            <PageBtn
              key={i}
              index={i}
              className={page == i ? styles.currentPage : ""}
              href={`/home/${i}`}
            />
          );
          continue;
        } else {
          if (pageBtns[pageBtns.length - 1].type === PageBtn) {
            pageBtns.push(
              <span key={i} className={styles.pageMore}>...</span>
            );
          }
        }
      } else {
        pageBtns.push(
          <PageBtn
            key={i}
            index={i}
            className={page == i ? styles.currentPage : ""}
            href={`/home/${i}`} />
        );
      }
    }
    return (
      <div className={styles.pagination}>
        {pageBtns}
      </div>
    );
  }
}

interface PageBtnProps extends React.ComponentPropsWithoutRef<"a"> {
  index: number;
  href: string;
}
function PageBtn(props: PageBtnProps) {
  const { index, href, className, ...rest } = props;
  const classes = `${styles.pageBtn} ${className}`;
  return (
    <Link to={href} {...rest}>
      <span className={classes}>{index}</span>
    </Link>
  );
}

export default withRouter(Pagination);
