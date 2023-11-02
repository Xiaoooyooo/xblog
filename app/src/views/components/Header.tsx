import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";

interface NavLink {
  name: string;
  path: string;
  assets?: string;
}
type HeaderProps = React.ComponentProps<"header">;

function Header(props: HeaderProps) {
  const links: NavLink[] = [
    {
      name: "",
      path: "/home",
    },
    {
      name: "首页",
      path: "/home",
    },
    {
      name: "关于我",
      path: "/about",
    },
  ];
  const [showBg, setShowBg] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleScroll = useCallback((e: Event) => {
    if (window.scrollY === 0) {
      setShowBg(false);
    } else {
      setShowBg(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const _links = links.map((el, index) => {
    return (
      <Link key={index} to={el.path} className={styles.link}>
        {el.name}
      </Link>
    );
  });
  const classes = `${styles.header} ${showBg ? styles.headerBg : ""}`;
  return (
    <header className={classes}>
      <nav className={styles.nav}>{_links}</nav>
    </header>
  );
}

export default Header;
