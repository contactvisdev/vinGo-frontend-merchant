import { useCallback, useRef } from "react";

export const useTapDetection = (onTap, { threshold = 10 } = {}) => {
  const startRef = useRef(null);

  const onPointerDown = useCallback((e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const dx = Math.abs(e.clientX - start.x);
      const dy = Math.abs(e.clientY - start.y);
      if (dx < threshold && dy < threshold) onTap();
    },
    [onTap, threshold],
  );

  return { onPointerDown, onPointerUp };
};
