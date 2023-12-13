import { Provider } from "react-redux";
import ThemeProvider, { Theme } from "./components/Theme";
import Routes from "@/routes";
import store from "@/redux";

import { init } from "@/redux/actions/user";
import { useEffect, useState } from "react";

store.dispatch(init());

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const l = localStorage.getItem("theme");
    if (l && /^(auto|light|dark)$/.test(l)) {
      return l as Theme;
    }
    localStorage.removeItem("theme");
    return "auto";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={{ theme, changeTheme: setTheme }}>
        <Routes />
      </ThemeProvider>
    </Provider>
  );
}
