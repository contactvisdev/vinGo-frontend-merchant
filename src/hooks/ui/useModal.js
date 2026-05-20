import { useState, useCallback, useEffect } from "react";


export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
};

export const useModalWithData = (initialData = null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const open = useCallback((modalData = null) => {
    if (modalData !== null) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(initialData);
  }, [initialData]);

  const toggle = useCallback(
    (modalData = null) => {
      if (isOpen) {
        close();
      } else {
        open(modalData);
      }
    },
    [isOpen, open, close],
  );

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
};
