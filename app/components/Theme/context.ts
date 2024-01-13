import { createContext, useContext } from "react";

export type Theme = "auto" | "light" | "dark";

export type ThemeContextOption = {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
};

const ThemeContext = createContext({} as ThemeContextOption);

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
