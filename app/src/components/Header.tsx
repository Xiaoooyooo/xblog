import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface NavLink {
  name: string;
  path: string;
  assets?: string;
}

function Header() {
  const links: NavLink[] = [
    {
      name: "",
      path: "/",
    },
    {
      name: "首页",
      path: "/",
    },
    {
      name: "关于我",
      path: "/about",
    },
  ];
  const [isBackgroundTransparent, setBackgroundTransparent] = useState(
    window.scrollY <= 200,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleScroll = useCallback((e: Event) => {
    if (window.scrollY <= 200) {
      setBackgroundTransparent(true);
    } else {
      setBackgroundTransparent(false);
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
      <Link
        key={index}
        to={el.path}
        className={classNames(
          "leading-[60px]",
          "px-5",
          "decoration-[none]",
          "text-white",
          "hover:text-[crimson]",
        )}
      >
        {el.name}
      </Link>
    );
  });
  return (
    <header
      className={classNames(
        "h-16",
        "px-16",
        "backdrop-blur-sm",
        "fixed",
        "top-0",
        "w-full",
        "z-[999]",
        "shadow",
        "transition-all",
        !isBackgroundTransparent && "bg-[rgba(30,33,40,0.8)]",
      )}
    >
      <nav className={classNames("flex", "justify-end", "h-full")}>
        {_links}
      </nav>
    </header>
  );
}

export default Header;
