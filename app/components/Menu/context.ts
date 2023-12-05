import { createContext, useContext } from "react";

import { MenuItem } from "./MenuItem";

type MenuContextOption = {
  isOpen: boolean;
  menus: MenuItem[];
  setMenu: (menus: MenuItem[]) => void;
  closeMenu: () => void;
  triggerRect?: DOMRect;
  setTriggerRect: (rect: DOMRect) => void;
};

const MenuContext = createContext({} as MenuContextOption);

function useMenuContext() {
  return useContext(MenuContext);
}

export { MenuContext, useMenuContext };
