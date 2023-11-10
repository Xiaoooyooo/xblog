import { useMemo } from "react";
import SkeletonItem from "./SkeletonItem";

type SkeletonProps = {
  rows?: number;
  animated?: boolean;
};

export default function Skeleton(props: SkeletonProps) {
  const { rows = 8, animated } = props;
  const items = useMemo(() => {
    const list = [];
    for (let i = 0; i < rows; i++) {
      list.push(
        <SkeletonItem
          key={i}
          animated={animated}
          {...(i === rows - 1 ? { width: "60%" } : {})}
        />,
      );
    }
    return list;
  }, [rows, animated]);
  return <div>{items}</div>;
}
