import classNames from "classnames";

type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function Switch(props: SwitchProps) {
  const { value, onChange } = props;
  function handleClick() {
    onChange(!value);
  }
  return (
    <div
      onClick={handleClick}
      className={classNames(
        "inline-block w-12 cursor-pointer rounded-full",
        "transition-[background] duration-200",
        value
          ? "bg-[--switch-active-background-color]"
          : "bg-[--switch-background-color]",
      )}
    >
      <div className="relative p-1">
        <div
          className={classNames(
            "h-5 w-5 bg-[--switch-foreground-color] rounded-full",
            "transition-all duration-200",
            value ? "translate-x-full" : "translate-x-0",
          )}
        ></div>
      </div>
    </div>
  );
}
