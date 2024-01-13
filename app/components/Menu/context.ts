import { createContext, useContext } from "react";

import { MenuItemProps } from "./MenuItem";

type MenuContextOption = {
  isOpen: boolean;
  menus: MenuItemProps[];
  setMenu: (menus: MenuItemProps[]) => void;
  closeMenu: () => void;
  triggerRect?: DOMRect;
  setTriggerRect: (rect: DOMRect) => void;
};

const MenuContext = createContext({} as MenuContextOption);

function useMenuContext() {
  return useContext(MenuContext);
}

export { MenuContext, useMenuContext };
