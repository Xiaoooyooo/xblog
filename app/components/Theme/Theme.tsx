import { PropsWithChildren, useLayoutEffect } from "react";

import ThemeContext, { ThemeContextOption } from "./context";

type ThemeProps = PropsWithChildren<{
  theme: ThemeContextOption;
}>;

export default function Theme(props: ThemeProps) {
  const { children, theme } = props;
  useLayoutEffect(() => {
    const t = theme.theme;
    if (t === "dark") {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
    } else if (t === "light") {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light", "theme-dark");
    }
  }, [theme.theme]);
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
