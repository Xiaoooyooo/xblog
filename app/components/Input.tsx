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

    return (
      <div
        className={classNames(
          "inline-block",
          "p-1",
          "rounded",
          type !== "plain" && [
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
          ],
          className,
        )}
      >
        {prefix && (
          <div className="inline-flex relative mr-3 items-center justify-center align-[-3px]">
            {prefix}
          </div>
        )}
        <input
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="flex-auto border-none outline-none bg-transparent"
          onInput={
            onInput && ((e) => onInput((e.target as HTMLInputElement).value))
          }
          onKeyDown={onKeyDown}
          ref={ref}
        />
      </div>
    );
  },
);
