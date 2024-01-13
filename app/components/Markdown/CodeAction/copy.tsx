import { useRef, useState } from "react";
import ClipboardIcon from "@/assets/icons/clipboard.svg";
import ClipboardCheckIcon from "@/assets/icons/clipboard-check.svg";
import ClipboardFailedIcon from "@/assets/icons/clipboard-x.svg";

type CopyProps = {
  text: string;
};

export function Copy(props: CopyProps) {
  const { text } = props;
  const [state, setState] = useState<0 | 1 | 2>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  function handleClick() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    navigator.permissions
      // @ts-expect-error "clipboard-write" expected to be not allowed
      .query({ name: "clipboard-write" })
      .then((res) => {
        if (res.state === "granted") {
          navigator.clipboard.write([
            new ClipboardItem({
              "text/plain": new Blob([text], { type: "text/plain" }),
            }),
          ]);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        const el = document.createElement("pre");
        el.style.position = "absolute";
        el.style.top = "0";
        el.style.zIndex = "-1";
        el.innerText = text;
        document.body.appendChild(el);
        document.getSelection()?.selectAllChildren(el);
        document.execCommand("copy");
        el.remove();
      })
      .then(() => {
        setState(1);
      })
      .catch((err) => {
        console.log(err);
        setState(2);
      })
      .finally(() => {
        timerRef.current = setTimeout(() => {
          setState(0);
        }, 1000);
      });
  }
  return (
    <div onClick={handleClick} className="cursor-pointer">
      {state === 0 && <ClipboardIcon />}
      {state === 1 && <ClipboardCheckIcon />}
      {state === 2 && <ClipboardFailedIcon />}
    </div>
  );
}
