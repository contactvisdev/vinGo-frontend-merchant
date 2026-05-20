import { useRef, useEffect } from "react";

/**
 * Custom hook to track previous value
 * @param {any} value - Value to track
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

