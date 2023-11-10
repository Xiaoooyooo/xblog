import { PropsWithChildren } from "react";
import classNames from "classnames";

type BackgroundProps = PropsWithChildren & {
  imageUrl: string;
  shift?: boolean;
  backgroundFixed?: boolean;
};

export default function Background(props: BackgroundProps) {
  const { imageUrl, shift, backgroundFixed, children } = props;
  return (
    <div
      style={{ backgroundImage: `url(${imageUrl})` }}
      className={classNames(
        "h-[40vh]",
        "bg-cover",
        "bg-center",
        "relative",
        shift && "-mb-24",
        backgroundFixed && "bg-fixed",
      )}
    >
      {children}
    </div>
  );
}
