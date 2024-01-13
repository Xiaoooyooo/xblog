import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ContentContainer from "@/components/ContentContainer";
import { SkeletonItem } from "@/components/Skeleton";
import { BlogList } from "@/components/Blogs";
import Pagination from "@/components/Pagination";
import { useCategoryDetail } from "@/services/category";
import { useBlogList } from "@/services/blog";

export default function CategoryDetail() {
  const params = useParams();
  const [pagination, setPagination] = useState({ total: 0 });
  const detail = useCategoryDetail(params.categoryId!);
  const currentPage = parseInt(params.pageIndex || "1");
  const memoized = useMemo(() => {
    return {
      categoryId: params.categoryId!,
      pageIndex: currentPage,
      pageSize: 10,
    };
  }, [params.categoryId, currentPage]);

  const documents = useBlogList(memoized);

  useEffect(() => {
    if (documents.isSuccess) {
      setPagination({ total: documents.result.total });
    }
  }, [documents]);

  return (
    <ContentContainer>
      <div className="p-5 border-b">
        {detail.isLoading ? (
          <>
            <SkeletonItem animated width={150} height={30} />
            <SkeletonItem animated width={300} />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{detail.result?.name}</h1>
            <div className="mt-4 text-sm">
              由 {detail.result?.createdBy.username} 于{" "}
              {detail.result?.createdAt} 创建
            </div>
          </>
        )}
      </div>
      <BlogList
        isLoading={documents.isLoading}
        isSuccess={documents.isSuccess}
        blogs={documents.result && documents.result.list}
        isError={documents.isError}
        error={documents.error}
        reload={documents.reload}
      />
      <Pagination
        href={(page) =>
          page === 1
            ? `/category/${params.categoryId!}`
            : `/category/${params.categoryId!}/page/${page}`
        }
        total={pagination.total}
        pageIndex={currentPage}
        pageSize={10}
      />
    </ContentContainer>
  );
}
