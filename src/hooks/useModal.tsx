import React from "react";
import useFocusTrap from "@charlietango/use-focus-trap";

export function useModal(initialState = false) {
  const [isOpen, setOpen] = React.useState(initialState);
  const close = React.useCallback(() => setOpen(false), []);
  const open = React.useCallback(() => setOpen(true), []);
  const ref = React.useRef<HTMLElement>();
  const focusTrapRef = useFocusTrap(isOpen);
  const modalRef = React.useCallback(
    (node: HTMLElement | null) => {
      focusTrapRef(node);
      if (node) {
        ref.current = node;
      }
    },
    [focusTrapRef]
  );

  // close on esc key
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handler(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      close();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, isOpen]);

  // close on click outside of modal
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handler(event: MouseEvent) {
      if (!ref.current) {
        return;
      }
      const target = event.target as HTMLElement;
      if (ref.current.contains(target)) {
        return;
      }
      close();
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [close, isOpen]);

  // Scroll lock
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [isOpen]);

  return { modalRef, isOpen, open, close };
}
