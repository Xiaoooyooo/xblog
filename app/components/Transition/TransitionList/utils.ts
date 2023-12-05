import { TransitionListContextOption } from "./TransitionList";

export function isChanged(prevRect: DOMRect, currRect: DOMRect) {
  for (const key in prevRect) {
    if (prevRect[key as keyof DOMRect] !== currRect[key as keyof DOMRect]) {
      return true;
    }
  }
  return false;
}

export function clearTransitionState(el: HTMLElement) {
  el.style.transition = "";
  el.style.transform = "";
  el.style.opacity = "";
}

export function enter(
  elements: HTMLElement[],
  context: TransitionListContextOption,
) {
  context.enterElements = [];
  for (const element of elements) {
    element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
    });
  }
}

export function leave(
  element: HTMLElement,
  originElement: HTMLElement,
  context: TransitionListContextOption,
) {
  context.currentPositions.delete(originElement);
  const top = element.offsetTop;
  const left = element.offsetLeft;
  console.log(element.offsetParent, { top, left });
  element.style.position = "absolute";
  element.style.top = top + "px";
  element.style.left = left + "px";
  element
    .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500 })
    .addEventListener("finish", function () {
      console.log("done");
      element.remove();
    });
}

export type MoveElementsState = [
  element: HTMLElement,
  prevRect: DOMRect,
  currRect: DOMRect,
][];

export function move(
  elements: MoveElementsState,
  context: TransitionListContextOption,
) {
  const moveTransitionEndCallback = function (e: TransitionEvent) {
    if (e.propertyName === "transform") {
      const target = e.target as HTMLElement;
      target.style.transition = "";
      context.movingElements.delete(target);
      context.transitionEndCallbacks.delete(target);
      target.removeEventListener("transitionend", moveTransitionEndCallback);
    }
  };

  for (const [element, prevRect, currRect] of elements) {
    const dx = prevRect.left - currRect.left;
    const dy = prevRect.top - currRect.top;
    console.log({ dx, dy });
    element.style.transform = `translate(${dx}px, ${dy}px)`;
    element.addEventListener("transitionend", moveTransitionEndCallback);
    context.transitionEndCallbacks.set(element, moveTransitionEndCallback);
  }

  requestAnimationFrame(() => {
    for (const [element] of elements) {
      element.style.transition = "all 500ms ease";
      element.style.transform = "";
    }
  });
}

export function removeTransitionEndCallback(
  el: HTMLElement,
  transitionEndCallbacks: TransitionListContextOption["transitionEndCallbacks"],
) {
  const callback = transitionEndCallbacks.get(el);
  if (callback) {
    el.removeEventListener("transitionend", callback);
  }
}
