import { useRef, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

type PaginationProps = {
  total: number; // 数据总量
  pageIndex: number; // 每页数据量大小
  pageSize: number; // 每页数据量大小
  pageBtnNumber?: number; // 最多显示的分页按钮
  onPaginationChange?: (currentPage: number, pageSize: number) => void;
  href: (page: number) => string;
};

const Pagination = function (props: PaginationProps) {
  const { total, pageIndex, pageSize, onPaginationChange, href } = props;
  const isFirstRender = useRef<boolean>(true);

  const pageBtns = useMemo(() => {
    const maxPageCount = Math.floor(total / pageSize) + 1;
    if (pageIndex > maxPageCount) {
      console.warn("current page index is invalid");
    }

    const currPage = pageIndex < maxPageCount ? pageIndex : maxPageCount;
    const bottons = [];
    bottons.push(
      <PageBtn
        key={currPage}
        index={currPage}
        active={currPage === pageIndex}
        href={href(currPage)}
      />,
    );
    let i = currPage;
    while (i + 1 <= maxPageCount && i + 1 <= pageIndex + 2) {
      i += 1;
      bottons.push(<PageBtn key={i} index={i} href={href(i)} />);
    }
    if (i + 1 === maxPageCount) {
      bottons.push(
        <PageBtn
          key={maxPageCount}
          index={maxPageCount}
          href={href(maxPageCount)}
        />,
      );
    } else if (i + 1 < maxPageCount) {
      bottons.push(
        <PageButtonEllipsis key={-1} />,
        <PageBtn
          key={maxPageCount}
          index={maxPageCount}
          href={href(maxPageCount)}
        />,
      );
    }
    i = currPage;
    while (i - 1 >= 1 && i - 1 >= pageIndex - 2) {
      i -= 1;
      bottons.unshift(<PageBtn key={i} index={i} href={href(i)} />);
    }
    if (i - 1 === 1) {
      bottons.unshift(<PageBtn key={1} index={1} href={href(1)} />);
    } else if (i - 1 > 1) {
      bottons.unshift(
        <PageBtn key={1} index={1} href={href(1)} />,
        <PageButtonEllipsis key={-2} />,
      );
    }
    return bottons;
  }, [pageIndex, pageSize, total]);

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }
  //   onPaginationChange && onPaginationChange(pageIndex, pageSize);
  // }, [pageIndex, pageSize]);

  return <div className="flex my-4 justify-center">{pageBtns}</div>;
};

interface PageBtnProps {
  index: number;
  href: string;
  active?: boolean;
}
function PageBtn(props: PageBtnProps) {
  const { index, href, active } = props;
  return (
    <Link to={{ pathname: href }}>
      <span
        className={classNames(
          "relative",
          "inline-block",
          "h-10",
          "w-10",
          "leading-10",
          "text-center",
          "rounded",
          "overflow-hidden",
          "transition-[background]",
          "duration-300",
          "hover:bg-[rgba(210,210,210,0.3)]",
          active && [
            "text-[#c85c5c]",
            "after:content-['']",
            "after:absolute",
            "after:z-[-1]",
            "after:inset-0",
            "after:bg-[rgba(210,210,210,0.7)]",
          ],
        )}
      >
        {index}
      </span>
    </Link>
  );
}

function PageButtonEllipsis() {
  return (
    <span className="inline-block h-10 w-10 leading-10 text-center">...</span>
  );
}
export default Pagination;
