import classNames from "classnames";
import {
  useState,
  useLayoutEffect,
  useRef,
  ReactElement,
  createElement,
  forwardRef,
  useEffect,
} from "react";

type TransitionProps = {
  show: boolean;
  duration: number;
  children: ReactElement;
  unmountOnHide?: boolean;
  transitionOnFirstMount?: boolean;
  beforeEnterClassName?: string;
  enterActiveClassName?: string;
  enterDoneClassName?: string;
  beforeLeaveClassName?: string;
  leaveActiveClassName?: string;
  leaveDoneClassName?: string;
  onExited?: () => void;
};

type TransitionStage =
  | "before-enter"
  | "enter-active"
  | "enter-done"
  | "before-leave"
  | "leave-active"
  | "leave-done";

export default forwardRef<HTMLElement, TransitionProps>(
  function Transition(props, ref) {
    const {
      show,
      duration,
      children,
      unmountOnHide,
      transitionOnFirstMount,
      beforeEnterClassName,
      enterActiveClassName,
      enterDoneClassName,
      beforeLeaveClassName,
      leaveActiveClassName,
      leaveDoneClassName,
      onExited,
    } = props;

    const [stage, setStage] = useState<TransitionStage>(() => {
      if (transitionOnFirstMount) {
        return show ? "leave-done" : "enter-done";
      }
      return show ? "enter-done" : "leave-done";
    });

    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useLayoutEffect(() => {
      if (show && stage.startsWith("leave-")) {
        if (stage === "leave-done") {
          setStage("before-enter");
        }
        requestAnimationFrame(() => {
          setStage("enter-active");
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
          }
          timerRef.current = setTimeout(() => {
            setStage("enter-done");
            timerRef.current = undefined;
          }, duration);
        });
      } else if (!show && stage.startsWith("enter-")) {
        if (stage === "enter-done") {
          setStage("before-leave");
        }
        requestAnimationFrame(() => {
          setStage("leave-active");
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
          }
          timerRef.current = setTimeout(() => {
            setStage("leave-done");
            timerRef.current = undefined;
          }, duration);
        });
      }
    }, [show, stage, duration]);

    useEffect(() => {
      if (!show && stage === "leave-done") {
        onExited?.();
      }
    }, [show, stage, onExited]);

    if (unmountOnHide && !show && stage === "leave-done") return null;

    return createElement(children.type, {
      ...children.props,
      ref,
      className: classNames(
        children.props.className,
        stage === "before-enter" && beforeEnterClassName,
        stage === "enter-active" && [enterActiveClassName, enterDoneClassName],
        stage === "enter-done" && enterDoneClassName,
        stage === "before-leave" && beforeLeaveClassName,
        stage === "leave-active" && [leaveActiveClassName, leaveDoneClassName],
        stage === "leave-done" && [
          leaveDoneClassName,
          !unmountOnHide && !show && "hidden",
        ],
      ),
    });
  },
);
