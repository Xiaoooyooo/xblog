import { PropsWithChildren, useEffect, useRef } from "react";
import classNames from "classnames";

type InfiniteScrollProps = PropsWithChildren<{
  className?: string;
  allowExec?: boolean;
  execFn?: () => void;
  execDistance?: number;
}>;

export default function InfiniteScroll(props: InfiniteScrollProps) {
  const { children, className, allowExec, execFn, execDistance = 50 } = props;
  const scrollElRef = useRef<HTMLDivElement>(null);
  const allowExecRef = useRef(allowExec);
  const execFnRef = useRef(execFn);
  const execDistanceRef = useRef(execDistance);

  useEffect(() => {
    allowExecRef.current = allowExec;
    execFnRef.current = execFn;
    execDistanceRef.current = execDistance;
  }, [allowExec, execFn, execDistance]);

  useEffect(() => {
    function handleReachBottom(this: HTMLDivElement, e: Event) {
      if (!allowExecRef.current) {
        return;
      }
      const { scrollHeight, scrollTop, clientHeight } = this;
      if (scrollTop + clientHeight + execDistanceRef.current >= scrollHeight) {
        execFnRef.current?.();
      }
    }
    if (!scrollElRef.current) {
      return;
    }
    scrollElRef.current.addEventListener("scrollend", handleReachBottom);
    return () => {
      scrollElRef.current?.removeEventListener("scrollend", handleReachBottom);
    };
  }, []);

  return (
    <div className={classNames(className)} ref={scrollElRef}>
      {children}
    </div>
  );
}
