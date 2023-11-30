import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Panel from "@/components/Panel";
import { SkeletonItem } from "@/components/Skeleton";
import Button from "@/components/Button";
import BlogList from "@/components/Blogs/BlogList";
import Pagination from "@/components/Pagination";
import { useBlogList } from "@/services/blog";
import RefreshIcon from "@/assets/icons/refresh.svg";

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
  const { isError, error, isLoading, isSuccess, result, reload } = useBlogList(
    pagination.pageIndex,
    pagination.pageSize,
  );

  useEffect(() => {
    if (isSuccess && result) {
      setPagination((p) => ({ ...p, total: result.total }));
    }
  }, [isSuccess, result]);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: Number(params.pageIndex || 1) }));
  }, [params.pageIndex]);

  // 骨架加载图
  const skeletonView = useMemo(
    () =>
      Array(10)
        .fill(0)
        .map((el, i) => <BlogSkeleton key={i} />),
    [],
  );

  return (
    <>
      <Panel shadow rounded>
        {/* {skeletonView} */}
        {isLoading ? (
          skeletonView
        ) : error ? (
          <div className="h-[500px] pt-[200px] text-center">
            <p className="text-slate-400">数据加载失败了，请稍后再试一下哦。</p>
            <Button
              onClick={reload}
              className="text-sky-500 flex items-center m-auto"
            >
              <RefreshIcon className="mr-1" />
              Reload
            </Button>
          </div>
        ) : (
          result && <BlogList blogs={result.list} />
        )}
      </Panel>
      <Pagination
        href={(page: number) => `/page/${page}`}
        total={pagination.total}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={handlePageChange}
      />
    </>
  );
}

function BlogSkeleton() {
  return (
    <div className="mt-12">
      <SkeletonItem animated height="24px" width="100px" />
      <SkeletonItem animated />
      <SkeletonItem animated />
      <div className="flex gap-4">
        <SkeletonItem animated width="60px" />
        <SkeletonItem animated width="60px" />
        <SkeletonItem animated width="60px" />
      </div>
    </div>
  );
}
