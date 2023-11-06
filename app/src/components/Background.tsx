import { PropsWithChildren } from "react";
import classNames from "classnames";

type BackgroundProps = PropsWithChildren & {
  imageUrl: string;
};
export default function Background(props: BackgroundProps) {
  const { imageUrl } = props;
  return (
    <div
      style={{ backgroundImage: `url(${imageUrl})` }}
      className={classNames(
        "h-[40vh]",
        "bg-cover",
        "bg-center",
        "-mb-24",
        "bg-fixed",
        "relative",
      )}
    ></div>
  );
}
