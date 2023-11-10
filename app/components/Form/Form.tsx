import classNames from "classnames";
import { PropsWithChildren } from "react";

type FormProps = PropsWithChildren & {
  className?: string;
};

export default function Form(props: FormProps) {
  const { children, className } = props;
  return <form className={classNames(className)}>{children}</form>;
}
