import { createContext, useContext } from "react";
import { SelectItemOption } from "./SelectItem";

type SelectContextOption = {
  handleSelect: (option: SelectItemOption) => void;
  isSelected: (option: SelectItemOption) => boolean;
};

const SelectContext = createContext<SelectContextOption>({
  handleSelect: () => {},
  isSelected: () => false,
});
export function useSelectContext() {
  return useContext(SelectContext);
}

export default SelectContext;
