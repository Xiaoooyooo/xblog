import { useEffect, useState } from "react";
import classNames from "classnames";
import debounce from "@/utils/debounce";
import ToolItem from "./ToolItem";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";

export default function BackTop() {
  const [isShow, setIsShow] = useState(false);
  function handleBackTop() {
    window.scroll({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const handleScroll = debounce(function () {
      if (window.scrollY >= 200) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    }, 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={classNames(
        "fixed z-50 right-[20px] bottom-[20px] md:right-[60px] md:bottom-[60px]",
        "transition-opacity duration-200",
        isShow ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <ToolItem
        tip="Back Top"
        element={<ArrowUpIcon className="h-5 w-5 md:h-7 md:w-7" />}
        onClick={handleBackTop}
      />
    </div>
  );
}
