import { ReactNode, forwardRef, KeyboardEventHandler } from "react";
import classNames from "classnames";
type InputProps = {
  type?: "plain" | "text" | "password";
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  onInput?: (value: string) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  className?: string;
  prefix?: ReactNode;
};

export default forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const {
      type = "text",
      value,
      placeholder,
      defaultValue,
      onInput,
      onKeyDown,
      className,
      prefix,
    } = props;

    const isPlain = type === "plain";

    return (
      <div
        className={classNames(
          "flex rounded",
          !isPlain && [
            "border-[1px]",
            "border-[#ddd]",
            "focus-within:border-blue-400",
            "outline outline-2",
            "outline-offset-0",
            "outline-transparent",
            "focus-within:outline-blue-300",
            "transition-all",
            "duration-200",
          ],
          className,
        )}
      >
        {prefix && (
          <div className="self-stretch flex items-center">{prefix}</div>
        )}
        <div className="flex-auto min-w-0">
          <input
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={classNames(
              "block w-full p-1 leading-none",
              "border-none outline-none bg-transparent",
              "group-[.x-select]:cursor-pointer",
            )}
            onInput={
              onInput && ((e) => onInput((e.target as HTMLInputElement).value))
            }
            onKeyDown={onKeyDown}
            ref={ref}
          />
        </div>
      </div>
    );
  },
);
