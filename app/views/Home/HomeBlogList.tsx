import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Panel from "@/components/Panel";
import { BlogList } from "@/components/Blogs";
import Pagination from "@/components/Pagination";
import { useBlogList } from "@/services/blog";

export default function HomeBlogList() {
  const params = useParams();
  const [pagination, setPagination] = useState({
    pageIndex: Number(params.pageIndex || 1),
    pageSize: 10,
    total: 0,
  });

  function handlePageChange(pageIndex: number, pageSize: number) {
    console.log("pagination:", pageIndex, pageSize);
    setPagination((p) => ({ ...p, pageIndex, pageSize }));
  }

  const memoized = useMemo(() => {
    return {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };
  }, [pagination.pageIndex, pagination.pageSize]);

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
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={handlePageChange}
      />
    </>
  );
}
