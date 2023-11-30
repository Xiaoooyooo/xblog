import classNames from "classnames";

type SkeletonItemProps = {
  height?: number | string;
  width?: number | string;
  mt?: number | string;
  animated?: boolean;
};

export default function SkeletonItem(props: SkeletonItemProps) {
  const { height = 16, width = "100%", animated, mt = 16 } = props;
  return (
    <div
      style={{ height, width, marginTop: mt }}
      className={classNames(
        "bg-[#e7e7e7]",
        "rounded",
        animated && "animate-pulse",
      )}
    ></div>
  );
}
