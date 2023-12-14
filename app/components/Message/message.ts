import { createRoot } from "react-dom/client";
import {
  createElement,
  ReactNode,
  FunctionComponentElement,
  cloneElement,
} from "react";
import Message, { MessageProps as BaseMessageProps } from "./MessageItem";
import { createPortal } from "react-dom";

const messageUpdateFns = new WeakMap();
const movingElements = new Set();
const exitingElements = new WeakSet();
const enterAnimations = new Map<HTMLElement, Animation>();
let top = 20;

function mounted(el: HTMLElement) {
  top += el.clientHeight + 10;
  el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 300,
    easing: "ease",
  });
  const animate = el.animate(
    [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
    {
      duration: 300,
      easing: "ease",
    },
  );
  animate.addEventListener("finish", () => {
    enterAnimations.delete(el);
  });
  enterAnimations.set(el, animate);
}

function getTransitionEndCallback(
  el: TransionHTMLElement,
  callback?: () => void,
) {
  return function __callback(e: TransitionEvent) {
    if (e.propertyName === "transform") {
      el.removeEventListener("transitionend", el.__transitionEndCallback!);
      el.style.transition = "";
      el.__transitionEndCallback = undefined;
      movingElements.delete(el);
      callback?.();
    }
  };
}

function exiting(el: TransionHTMLElement, callback: () => void) {
  const fn = function () {
    exitingElements.add(el);
    top -= el.clientHeight + 10;
    el.style.zIndex = "9998";
    el.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(-10px) scale(.9)" },
      ],
      { duration: 300, easing: "ease" },
    ).addEventListener("finish", function () {
      callback();
    });
    move(el);
  };
  if (movingElements.has(el)) {
    el.removeEventListener("transitionend", el.__transitionEndCallback!);
    el.__transitionEndCallback = getTransitionEndCallback(el, fn);
    el.addEventListener("transitionend", el.__transitionEndCallback);
  } else {
    fn();
  }
}

type TransionHTMLElement = HTMLElement & {
  __transitionEndCallback?: (e: TransitionEvent) => void;
};

function move(element: TransionHTMLElement) {
  let sibling = element.nextElementSibling as HTMLElement;
  const elements: TransionHTMLElement[] = [];
  while (sibling) {
    if (sibling.matches(".x-message") && !exitingElements.has(sibling)) {
      elements.push(sibling);
    }
    if (enterAnimations.has(sibling)) {
      enterAnimations.get(sibling)!.cancel();
      enterAnimations.delete(sibling);
    }
    sibling = sibling.nextElementSibling as HTMLElement;
  }
  const height = element.clientHeight;
  for (const el of elements) {
    const { render, top } = messageUpdateFns.get(el);
    const { top: rTop } = el.getBoundingClientRect();
    const _top = top - height - 10;
    messageUpdateFns.set(el, { render, top: _top });
    if (movingElements.has(el)) {
      el.removeEventListener("transitionend", el.__transitionEndCallback!);
      el.style.transition = "";
    } else {
      movingElements.add(el);
      el.__transitionEndCallback = getTransitionEndCallback(el);
    }
    render({
      top: _top,
      nextCallback: () => {
        const { top: _top } = el.getBoundingClientRect();
        el.style.transform = `translateY(${rTop - _top}px)`;
        el.addEventListener("transitionend", el.__transitionEndCallback!);
        requestAnimationFrame(() => {
          el.style.transition = `transform 400ms ease`;
          el.style.transform = "";
        });
      },
    });
  }
}

type MessageProps = Omit<
  BaseMessageProps,
  | "top"
  | "onMounted"
  | "beforeUnmounted"
  | "onMounted"
  | "onExiting"
  | "nextCallback"
>;

export default function message(props: MessageProps) {
  const fragment = document.createDocumentFragment();
  const root = createRoot(fragment);
  let _isUnmounted = false;
  let _element: FunctionComponentElement<BaseMessageProps>;
  const _top = top;
  const render = function (props: Partial<MessageProps>) {
    if (_isUnmounted) {
      return;
    }
    if (!_element) {
      _element = createElement(Message, {
        ...(props as MessageProps),
        top: _top,
        onMounted: function (el) {
          mounted(el);
          messageUpdateFns.set(el, { render, top: _top });
        },
        onExiting: function (el) {
          exiting(el, function () {
            _isUnmounted = true;
            root.unmount();
          });
        },
      });
    } else {
      _element = cloneElement(_element, { ..._element.props, ...props });
    }
    const portal = createPortal(_element, document.body);
    root.render(portal);
  };

  render(props);

  return {
    updateMessage: function (message: ReactNode) {
      render({ message });
    },
  };
}
