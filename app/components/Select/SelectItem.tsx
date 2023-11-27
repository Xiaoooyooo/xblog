import classNames from "classnames";
import { useSelectContext } from "./SelectContext";
import { Transition } from "../Transition";
import CheckIcon from "@/assets/icons/check.svg";

export type SelectItemOption = {
  label: string;
  value: string;
  isCreated?: boolean;
};

type SelectItemProps = {
  item: SelectItemOption;
};

export default function SelectItem(props: SelectItemProps) {
  const { item } = props;
  const { handleSelect, isSelected } = useSelectContext();

  if (!handleSelect) {
    throw "<SelectItem /> can only be used in <Select /> component";
  }

  const selected = isSelected(item);
  return (
    <div
      className={classNames(
        "p-2 cursor-pointer hover:bg-slate-400 transition-all duration-200",
        "flex items-center",
        selected && "bg-sky-200",
      )}
      onClick={() => handleSelect(item)}
    >
      <span className="flex-[0_0_auto] basis-7">
        <Transition
          show={selected}
          duration={200}
          beforeEnterClassName="opacity-0"
          enterActiveClassName="transition-all duration-200"
          enterDoneClassName="opacity-100"
          beforeLeaveClassName="opacity-100"
          leaveActiveClassName="transition-all duration-200"
          leaveDoneClassName="opacity-0"
          unmountOnHide
        >
          <CheckIcon />
        </Transition>
      </span>
      <span>{item.label}</span>
    </div>
  );
}
