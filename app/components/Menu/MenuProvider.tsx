import { useState, useCallback, PropsWithChildren } from "react";
import { MenuContext } from "./context";
import { MenuItem } from "./MenuItem";

import Menu from "./Menu";

type MenuProviderProps = PropsWithChildren;

export default function MenuProvider(props: MenuProviderProps) {
  const { children } = props;
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [triggerRect, setTriggerRect] = useState<DOMRect>();

  const handleSetMenu = useCallback((menus: MenuItem[]) => {
    setMenus(menus);
    setIsOpenMenu(true);
  }, []);

  const handleSetTriggerRect = useCallback((rect: DOMRect) => {
    setTriggerRect(rect);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsOpenMenu(false);
  }, []);

  return (
    <MenuContext.Provider
      value={{
        isOpen: isOpenMenu,
        menus,
        setMenu: handleSetMenu,
        closeMenu: handleCloseMenu,
        triggerRect,
        setTriggerRect: handleSetTriggerRect,
      }}
    >
      <>
        {children}
        <Menu />
      </>
    </MenuContext.Provider>
  );
}
