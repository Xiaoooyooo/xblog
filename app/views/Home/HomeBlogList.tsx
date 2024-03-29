import { useEffect, useMemo, useState } from "react";
import { useParams, useMatch } from "react-router-dom";
import Panel from "@/components/Panel";
import { BlogList } from "@/components/Blogs";
import Pagination from "@/components/Pagination";
import { useBlogList } from "@/services/blog";

type HomeBlogListProps = {
  isDraft?: boolean;
};

export default function HomeBlogList(props: HomeBlogListProps) {
  const { isDraft } = props;
  const params = useParams();
  const currentPage = parseInt(params.pageIndex || "1");

  const [pagination, setPagination] = useState({
    total: 0,
  });

  const memoized = useMemo(() => {
    return {
      pageIndex: currentPage,
      pageSize: 10,
      draft: isDraft,
    };
  }, [currentPage, isDraft]);

  const { isError, error, isLoading, isSuccess, result, reload } =
    useBlogList(memoized);

  useEffect(() => {
    if (isSuccess) {
      setPagination((p) => ({ ...p, total: result.total }));
    }
  }, [isSuccess, result]);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: Number(params.pageIndex || 1) }));
  }, [params.pageIndex]);

  return (
    <>
      <Panel shadow rounded>
        <BlogList
          isLoading={isLoading}
          isSuccess={isSuccess}
          blogs={result && result.list}
          isError={isError}
          error={error}
          reload={reload}
        />
      </Panel>
      <Pagination
        href={(page: number) => (page === 1 ? "/" : `/page/${page}`)}
        total={pagination.total}
        pageIndex={currentPage}
        pageSize={10}
      />
    </>
  );
}
