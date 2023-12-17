import { memo, useLayoutEffect } from "react";
import { SkeletonItem } from "@/components/Skeleton";

function BlogSkeleton() {
  return (
    <div className="mt-12">
      <SkeletonItem animated height="24px" width="100px" />
      <SkeletonItem animated />
      <SkeletonItem animated />
      <SkeletonItem animated inline width="60px" />
      &nbsp;&nbsp;
      <SkeletonItem animated inline width="60px" />
      &nbsp;&nbsp;
      <SkeletonItem animated inline width="60px" />
    </div>
  );
}

type BlogListSkeletonProps = {
  count?: number;
};

function BlogListSkeleton(props: BlogListSkeletonProps) {
  const { count = 10 } = props;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return Array(count)
    .fill(0)
    .map((i, index) => <BlogSkeleton key={index} />);
}

export default memo(BlogListSkeleton);
