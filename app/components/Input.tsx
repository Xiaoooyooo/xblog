import classNames from "classnames";
type InputProps = {
  type?: "text" | "password";
  value?: string;
  defaultValue?: string;
  onInput?: (value: string) => void;
};

export default function Input(props: InputProps) {
  const { type = "text", value, defaultValue, onInput } = props;

  return (
    <input
      type={type}
      value={value}
      defaultValue={defaultValue}
      className={classNames(
        "w-full",
        "rounded",
        "p-1",
        "border-[1px]",
        "border-[#ddd]",
        "focus:border-blue-400",
        "outline-2",
        "outline",
        "outline-offset-0",
        "outline-transparent",
        "focus:outline-blue-300",
        "transition-all",
        "duration-200",
      )}
      onInput={
        onInput && ((e) => onInput((e.target as HTMLInputElement).value))
      }
    />
  );
}
