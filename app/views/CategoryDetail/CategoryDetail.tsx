import { useState } from "react";
import { useParams } from "react-router-dom";
import ContentContainer from "@/components/ContentContainer";
import { SkeletonItem } from "@/components/Skeleton";
import BlogList from "@/components/Blogs/BlogList";
import Pagination from "@/components/Pagination";
import {
  useCategoryDetail,
  useGatCategoryDocuments,
} from "@/services/category";

export default function CategoryDetail() {
  const params = useParams();
  console.log({ params });
  const [pagination, setPagination] = useState({ total: 0 });
  const { isError, error, isLoading, isSuccess, result } = useCategoryDetail(
    params.categoryId!,
  );
  const currentPage = parseInt(params.pageIndex || "1");
  const documents = useGatCategoryDocuments(
    params.categoryId!,
    currentPage,
    10,
  );

  return (
    <ContentContainer>
      <div className="p-5 border-b">
        {isLoading ? (
          <>
            <SkeletonItem animated width={150} height={30} />
            <SkeletonItem animated width={300} />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{result?.name}</h1>
            <div className="mt-4 text-sm">
              由 {result?.createdBy.username} 于 {result?.createdAt} 创建
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
