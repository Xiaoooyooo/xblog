import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { Transition } from "../Transition";
import XIcon from "@/assets/icons/x.svg";

type ModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  onClosed?: () => void;
}>;

export default function Modal(props: ModalProps) {
  const { children, visible, onClose, onClosed } = props;
  const [isRenderContainer, setIsRenderContainer] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsRenderContainer(true);
    }
  }, [visible]);

  const _onClosed = useCallback(() => {
    setIsRenderContainer(false);
    onClosed?.();
  }, [onClosed]);

  if (!visible && !isRenderContainer) {
    return null;
  }

  return createPortal(
    <div className="fixed z-[9999] h-full w-full top-0 left-0 flex justify-center items-center">
      <Transition
        show={visible}
        duration={300}
        onExited={_onClosed}
        beforeEnterClassName="opacity-0"
        enterActiveClassName="transition-all duration-300"
        leaveActiveClassName="transition-all duration-300"
        leaveDoneClassName="opacity-0"
        unmountOnHide
        transitionOnFirstMount
      >
        <div className="absolute inset-0 bg-[--modal-mask-background-color]"></div>
      </Transition>
      <Transition
        show={visible}
        duration={300}
        onExited={onClosed}
        beforeEnterClassName="opacity-0 translate-y-[20px]"
        enterActiveClassName="transition-all duration-300"
        enterDoneClassName="opacity-100"
        leaveActiveClassName="transition-all duration-300"
        beforeLeaveClassName="scale-100"
        leaveDoneClassName="opacity-0 scale-90"
        unmountOnHide
        transitionOnFirstMount
      >
        <div className="relative z-10">
          <div
            className={classNames(
              "absolute top-0 right-0 h-6 w-6 cursor-pointer",
              "translate-x-full -translate-y-full rounded-full",
              "bg-slate-300 hover:bg-slate-400 transition-colors duration-200",
            )}
            onClick={onClose}
          >
            <XIcon className="h-full w-full" />
          </div>
          {children}
        </div>
      </Transition>
    </div>,
    document.body,
  );
}
