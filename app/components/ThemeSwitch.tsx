import { useTheme } from "./Theme/context";
import SunIcon from "@/assets/icons/sun.svg";
import MoonIcon from "@/assets/icons/moon-stars.svg";
import CircleHalfIcon from "@/assets/icons/circle-half.svg";
import { useCallback, useRef } from "react";
import Tooltip from "./Tooltip";

export default function ThemeSwitch() {
  const { theme, changeTheme } = useTheme();
  const themes: (typeof theme)[] = ["auto", "dark", "light"];
  const themeIndexRef = useRef(0);

  const handleChangeTheme = useCallback(() => {
    const curr = themeIndexRef.current;
    themeIndexRef.current = curr === 2 ? 0 : curr + 1;
    changeTheme(themes[themeIndexRef.current]);
  }, []);

  return (
    <div className="h-full aspect-square">
      <Tooltip
        className="h-full w-full"
        tip={theme.replace(/^\w/, (match) => match.toUpperCase())}
        placement="bottom"
        unmountTipOnHide
        mountOnBody
      >
        <button
          className="h-full w-full flex items-center justify-center"
          onClick={handleChangeTheme}
        >
          {theme === "light" && (
            <SunIcon fill="currentColor" height={22} width={22} />
          )}
          {theme === "dark" && (
            <MoonIcon fill="currentColor" height={22} width={22} />
          )}
          {theme === "auto" && (
            <CircleHalfIcon fill="currentColor" height={22} width={22} />
          )}
        </button>
      </Tooltip>
    </div>
  );
}
