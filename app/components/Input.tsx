import { ReactNode } from "react";
import classNames from "classnames";
type InputProps = {
  type?: "text" | "password";
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  onInput?: (value: string) => void;
  className?: string;
  prefix?: ReactNode;
};

export default function Input(props: InputProps) {
  const {
    type = "text",
    value,
    placeholder,
    defaultValue,
    onInput,
    className,
    prefix,
  } = props;

  return (
    <div
      className={classNames(
        "flex",
        "rounded",
        "p-1",
        "border-[1px]",
        "border-[#ddd]",
        "focus-within:border-blue-400",
        "outline-2",
        "outline",
        "outline-offset-0",
        "outline-transparent",
        "focus-within:outline-blue-300",
        "transition-all",
        "duration-200",
        className,
      )}
    >
      {prefix && (
        <div className="inline-flex relative mr-3 items-center justify-center">
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex-auto border-none outline-none"
        onInput={
          onInput && ((e) => onInput((e.target as HTMLInputElement).value))
        }
      />
    </div>
  );
}
