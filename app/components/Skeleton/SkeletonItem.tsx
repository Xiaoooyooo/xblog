import classNames from "classnames";

type SkeletonItemProps = {
  height?: number | string;
  width?: number | string;
  animated?: boolean;
};

export default function SkeletonItem(props: SkeletonItemProps) {
  const { height = 16, width = "100%", animated } = props;
  return (
    <div
      style={{ height, width }}
      className={classNames(
        "bg-[#e7e7e7]",
        "mt-4",
        "rounded",
        animated && "animate-pulse",
      )}
    ></div>
  );
}
