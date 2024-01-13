import { memo } from "react";
import { SkeletonItem } from "@/components/Skeleton";

function CategorySkeleton() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push(
      <div key={i} className="mb-8">
        <SkeletonItem animated height={24} />
        <SkeletonItem animated width={150} />
      </div>,
    );
  }
  return items;
}

export default memo(CategorySkeleton);
