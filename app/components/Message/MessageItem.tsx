import classNames from "classnames";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import CheckIcon from "@/assets/icons/check.svg";
import XIcon from "@/assets/icons/x.svg";
import ExclamationIcon from "@/assets/icons/exclamation.svg";

export type MessageProps = {
  type: "plain" | "success" | "warning" | "error";
  message: ReactNode;
  duration?: number;
  top: number;
  onMounted: (element: HTMLElement) => void;
  onExiting: (element: HTMLElement) => void;
  nextCallback?: { (): void; called: boolean };
};

export default function Message(props: MessageProps) {
  const { type, message, duration, top, onMounted, onExiting, nextCallback } =
    props;

  const elRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState("0px");

  useLayoutEffect(() => {
    onMounted(elRef.current!);
    setLeft(`calc(50% - ${elRef.current!.clientWidth / 2}px)`);
  }, []);

  useLayoutEffect(() => {
    if (nextCallback && !nextCallback.called) {
      nextCallback.called = true;
      requestAnimationFrame(nextCallback);
    }
  }, [nextCallback]);

  useEffect(() => {
    setTimeout(() => {
      onExiting(elRef.current!);
    }, duration);
  }, []);

  return (
    <div
      className={classNames(
        "x-message",
        "fixed z-[9999]",
        "bg-[--message-background-color] shadow-lg py-2 px-4 rounded",
        "flex justify-center items-center gap-x-2",
        type === "success" && [
          "bg-[--success-background-color]",
          "text-[--success-text-color]",
        ],
        type === "error" && [
          "bg-[--error-background-color]",
          "text-[--error-text-color]",
        ],
        type === "warning" && [
          "bg-[--warning-background-color]",
          "text-[--warning-text-color]",
        ],
      )}
      style={{ top, left }}
      ref={elRef}
    >
      {type === "success" && <CheckIcon height={24} width={24} />}
      {type === "error" && <XIcon height={24} width={24} />}
      {type === "warning" && <ExclamationIcon height={24} width={24} />}
      <span>{message}</span>
    </div>
  );
}
