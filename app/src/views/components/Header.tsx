import React from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";

interface NavLink {
  name: string;
  path: string;
  assets?: string;
}
type HeaderProps = React.ComponentProps<"header">;
interface HeaderState {
  showBg: boolean;
}
class Header extends React.Component<HeaderProps, HeaderState> {
  links: NavLink[] = [
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
    }
  ];
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      showBg: false,
    };
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleScroll = (e: Event) => {
    if (window.scrollY === 0) {
      this.setState({
        showBg: false,
      });
    } else {
      this.setState({
        showBg: true,
      });
    }
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  render() {
    const links = this.links.map((el, index) => {
      return (
        <Link
          key={index}
          to={el.path}
          className={styles.link}
        >
          {el.name}
        </Link>
      );
    });
    const { showBg } = this.state;
    const classes = `${styles.header} ${showBg ? styles.headerBg : ""}`;
    return (
      <header className={classes}>
        <nav className={styles.nav}>
          {links}
        </nav>
      </header>
    );
  }
}

export default Header;