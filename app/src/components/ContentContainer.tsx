import classNames from "classnames";
import { PropsWithChildren } from "react";

type ContentContainerProps = PropsWithChildren;
export default function ContentContainer(props: ContentContainerProps) {
  const { children } = props;

  return (
    <div
      className={classNames(
        "sm:w-[600px]",
        "md:w-[900px]",
        "lg:w-[1100px]",
        "m-auto",
      )}
    >
      {children}
    </div>
  );
}
