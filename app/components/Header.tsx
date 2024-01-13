import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Menu } from "./Menu";
import ThemeSwitch from "./ThemeSwitch";
import { useSelector } from "@/hooks/redux";
import ROLE from "@@/constants/role";

interface NavLink {
  name: string;
  path: string;
  assets?: string;
}

function Header() {
  const user = useSelector((state) => state.user);
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
      name: "分类",
      path: "/category",
    },
  ];

  if (user.isLogin && user.role === ROLE.SUPERADMIN) {
    links.push({
      name: "管理",
      path: "/admin",
    });
  }

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
          "px-3 md:px-5",
          "leading-[--header-height]",
          "md:hover:text-[--header-text-hover-color]",
          "transition-colors",
          "duration-300",
        )}
      >
        {el.name}
      </Link>
    );
  });
  return (
    <header
      className={classNames(
        "h-[--header-height]",
        "md:px-16",
        "backdrop-blur-sm",
        "fixed",
        "top-0",
        "w-full",
        "z-[999]",
        "shadow",
        "transition-all",
        "bg-[--header-background-color]",
        "text-[--header-text-color]",
        "flex",
        // !isBackgroundTransparent && "bg-[rgba(30,33,40,0.8)]",
      )}
    >
      <nav className="flex-auto flex justify-end h-full">{_links}</nav>
      {user.isLogin && (
        <Link to={{ pathname: `/user/${user.id}` }}>
          <div className="h-full mx-5 flex gap-x-2 items-center">
            {user.avatar && (
              <div className="rounded-full overflow-hidden">
                <img
                  src={`/assets/avatar/${user.avatar}`}
                  className="h-8 w-8"
                />
              </div>
            )}
            <div className="hidden md:block">{user.username}</div>
          </div>
        </Link>
      )}
      <div className="h-full w-[2px] py-4 bg-gray-500 bg-clip-content"></div>
      <ThemeSwitch />
    </header>
  );
}

export default Header;
