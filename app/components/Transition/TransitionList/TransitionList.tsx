import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

import {
  clearTransitionState,
  isChanged,
  enter,
  leave,
  move,
  MoveElementsState,
  removeTransitionEndCallback,
} from "./utils";
import classNames from "classnames";

export type TransitionListContextOption = {
  currentPositions: Map<HTMLElement, DOMRect>;
  movingElements: Set<HTMLElement>;
  transitionEndCallbacks: Map<HTMLElement, (e: TransitionEvent) => void>;
  enterElements: HTMLElement[];
  handleFLIP: () => void;
};

const TransitionListContext = createContext({} as TransitionListContextOption);
function getInitialContextValue(): TransitionListContextOption {
  const currentPositions = new Map<HTMLElement, DOMRect>();
  const movingElements = new Set<HTMLElement>();
  const transitionEndCallbacks = new Map();
  const context = {
    currentPositions,
    movingElements,
    transitionEndCallbacks,
    enterElements: [],
    handleFLIP() {
      console.log("flip");
      const idleElements: MoveElementsState = [];
      const transitionPendingElements: HTMLElement[] = [];
      for (const [el, position] of [...currentPositions.entries()]) {
        if (movingElements.has(el)) {
          // in transition elements
          transitionPendingElements.push(el);
        } else {
          const currPosition = el.getBoundingClientRect();
          if (isChanged(position, currPosition)) {
            idleElements.push([el, position, currPosition]);
            movingElements.add(el);
          }
        }
      }
      if (!transitionPendingElements.length && !idleElements.length) {
        console.log("no change");
      }
      console.log({ idleElements, transitionPendingElements });
      if (transitionPendingElements.length) {
        const t: MoveElementsState = [];
        for (const element of transitionPendingElements) {
          removeTransitionEndCallback(element, transitionEndCallbacks);
          clearTransitionState(element);
          const lastPosition = element.getBoundingClientRect();
          const firstPosition = currentPositions.get(element)!;
          movingElements.add(element);
          t.push([element, firstPosition, lastPosition]);
        }
        move(t, context);
      }
      if (idleElements.length) {
        move(idleElements, context);
      }
    },
  };
  return context;
}

type TransitionListProps = PropsWithChildren<{
  className?: string;
}>;

export function TransitionList(props: TransitionListProps) {
  const { children, className } = props;
  const contextValue = useMemo(getInitialContextValue, []);

  useEffect(() => {
    enter(contextValue.enterElements, contextValue);
    contextValue.handleFLIP();
  }, [children]);

  return (
    <TransitionListContext.Provider value={contextValue}>
      <div className={classNames(className)}>{children}</div>
    </TransitionListContext.Provider>
  );
}

type TransitionListItemProps = PropsWithChildren;
export function TransitionListItem(props: TransitionListItemProps) {
  const { children } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const context = useContext(TransitionListContext);

  useLayoutEffect(() => {
    if (elRef.current) {
      context.currentPositions.set(
        elRef.current,
        elRef.current.getBoundingClientRect(),
      );
      context.enterElements.push(elRef.current);
    }
    return () => {
      if (elRef.current && context.currentPositions.has(elRef.current)) {
        const clonedElement = elRef.current.cloneNode(true) as HTMLElement;
        elRef.current.insertAdjacentElement("beforebegin", clonedElement);
        leave(clonedElement, elRef.current, context);
      }
    };
  }, []);

  // update current position
  if (elRef.current) {
    context.currentPositions.set(
      elRef.current,
      elRef.current.getBoundingClientRect(),
    );
  }

  return <div ref={elRef}>{children}</div>;
}
