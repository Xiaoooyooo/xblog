import React from "react";
import { Link, useParams } from "react-router-dom";

import styles from "./Pagination.module.scss";

type PaginationProps = React.ComponentProps<"div">
  & {
    total: number;
    pageSize: number; // 每页
    pageBtnNumber?: number; // 最多显示的分页按钮
    onPageChange?: () => void;
  };

type PaginationParams = {
  page: number;
}
const Pagination: React.FunctionComponent<
  PaginationProps
> = function (props) {
  const maxPageCountRef = React.useRef(Math.ceil(props.total / props.pageSize));
  const maxPageCount = maxPageCountRef.current;

  const { page: currentPage } = useParams<keyof PaginationParams>();
  const page = Number(currentPage);
  const { pageBtnNumber = 7 } = props;

  const pageBtns = [];
  for (let i = 1; i <= maxPageCount; i++) {
    if (i === 1) {
      pageBtns.push(
        <PageBtn
          key={i}
          index={i}
          className={page === i ? styles.currentPage : ""}
          href={`/home/${i}`} />
      );
      continue;
    }
    if (i === maxPageCount) {
      pageBtns.push(
        <PageBtn
          key={i}
          index={i}
          className={page === i ? styles.currentPage : ""}
          href={`/home/${i}`} />
      );
      continue;
    }
    if (maxPageCount > pageBtnNumber) {
      if (
        i === page - 2 ||
        i === page - 1 ||
        i === page ||
        i === page + 1 ||
        i === page + 2
      ) {
        pageBtns.push(
          <PageBtn
            key={i}
            index={i}
            className={page === i ? styles.currentPage : ""}
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
          className={page === i ? styles.currentPage : ""}
          href={`/home/${i}`} />
      );
    }
  }
  return (
    <div className={styles.pagination}>
      {pageBtns}
    </div>
  );
};

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

export default Pagination;
