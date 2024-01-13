import classNames from "classnames";
import { PropsWithChildren } from "react";

type ContentContainerProps = PropsWithChildren & {
  className?: string;
};
export default function ContentContainer(props: ContentContainerProps) {
  const { children, className } = props;

  return (
    <div
      className={classNames(
        "mx-4",
        "sm:w-[600px]",
        "md:w-[900px]",
        "lg:w-[1100px]",
        "sm:mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
