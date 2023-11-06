import useBlogsWithPage from "@/hooks/useBlogsWithPage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Panel from "./Panel";
import { SkeletonItem } from "./Skeleton";
import Button from "./_Base/Button";
import BlogList from "./Blogs/BlogList";
import Pagination from "./Pagination";
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
  const { error, loading, data, reload } = useBlogsWithPage(
    pagination.pageIndex,
    pagination.pageSize,
  );
  console.log({ error, loading, data });

  useEffect(() => {
    if (data?.total) {
      setPagination((p) => ({ ...p, total: data.total }));
    }
  }, [data?.total]);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: Number(params.pageIndex || 1) }));
  }, [params.pageIndex]);

  // 骨架加载图
  const skeletonView = Array(10)
    .fill(0)
    .map((el, i) => <BlogSkeleton key={i} />);

  return (
    <>
      <Panel shadow rounded>
        {/* {skeletonView} */}
        {loading ? (
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
          data && <BlogList blogs={data.blogs} />
        )}
      </Panel>
      <Pagination
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
