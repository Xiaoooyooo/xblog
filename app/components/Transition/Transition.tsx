import classNames from "classnames";
import {
  useState,
  useLayoutEffect,
  useRef,
  cloneElement,
  ReactElement,
} from "react";

type TransitionProps = {
  show: boolean;
  duration: number;
  children: ReactElement;
  unmountOnHide?: boolean;
  beforeEnterClassName?: string;
  enterActiveClassName?: string;
  enterDoneClassName?: string;
  beforeLeaveClassName?: string;
  leaveActiveClassName?: string;
  leaveDoneClassName?: string;
};

type TransitionStage =
  | "before-enter"
  | "enter-active"
  | "enter-done"
  | "before-leave"
  | "leave-active"
  | "leave-done";

export default function Transition(props: TransitionProps) {
  const {
    show,
    duration,
    children,
    unmountOnHide,
    beforeEnterClassName,
    enterActiveClassName,
    enterDoneClassName,
    beforeLeaveClassName,
    leaveActiveClassName,
    leaveDoneClassName,
  } = props;
  const [stage, setStage] = useState<TransitionStage>(
    show ? "enter-done" : "leave-done",
  );
  const isMountRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useLayoutEffect(() => {
    if (!isMountRef.current) {
      isMountRef.current = true;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    if (show) {
      setStage("before-enter");
      requestAnimationFrame(() => {
        setStage("enter-active");
        timerRef.current = setTimeout(() => {
          setStage("enter-done");
        }, duration);
      });
    } else {
      setStage("before-leave");
      requestAnimationFrame(() => {
        setStage("leave-active");
        timerRef.current = setTimeout(() => {
          setStage("leave-done");
        }, duration);
      });
    }
  }, [show, duration]);

  console.log({ stage });
  if (unmountOnHide && stage === "leave-done") return null;
  return cloneElement(children, {
    ...children.props,
    className: classNames(
      children.props.className,
      stage === "before-enter" && beforeEnterClassName,
      stage === "enter-active" && [enterActiveClassName, enterDoneClassName],
      stage === "enter-done" && enterDoneClassName,
      stage === "before-leave" && beforeLeaveClassName,
      stage === "leave-active" && [leaveActiveClassName, leaveDoneClassName],
      stage === "leave-done" && [leaveDoneClassName, "hidden"],
    ),
  });
}
