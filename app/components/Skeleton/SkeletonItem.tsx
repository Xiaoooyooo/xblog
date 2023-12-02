import classNames from "classnames";

type SkeletonItemProps = {
  height?: number | string;
  width?: number | string;
  animated?: boolean;
  inline?: boolean;
};

export default function SkeletonItem(props: SkeletonItemProps) {
  const { height = 16, width = "100%", animated, inline } = props;
  return (
    <div
      style={{ height, width }}
      className={classNames(
        "bg-[#e7e7e7]",
        "rounded",
        "mt-4",
        "first:mt-0",
        animated && "animate-pulse",
        inline && "inline-block",
      )}
    ></div>
  );
}
