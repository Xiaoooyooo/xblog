import { createContext, useContext, MouseEventHandler } from "react";

type ListContextOption = {
  handleItemMouseEnter: MouseEventHandler;
  handleItemMouseLeave: MouseEventHandler;
};

const ListContext = createContext<ListContextOption>({
  handleItemMouseEnter: () => {},
  handleItemMouseLeave: () => {},
});

export function useListContext() {
  return useContext(ListContext);
}

export default ListContext;
