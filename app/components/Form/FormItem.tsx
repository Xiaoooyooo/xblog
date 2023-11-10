import { PropsWithChildren } from "react";

type FormItemProps = PropsWithChildren & {
  label?: string;
};

export default function FormItem(props: FormItemProps) {
  const { children, label } = props;

  return (
    <div className="block mb-6">
      {label && <div className="mb-1 text-base text-gray-500">{label}</div>}
      <div>{children}</div>
    </div>
  );
}
