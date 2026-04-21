import { useCallback, useRef } from "react";

interface Options {
  delay?: number;
  onLongPress: () => void;
  onClick?: () => void;
}

/**
 * Long-press hook. Fires `onLongPress` after `delay` ms of pointer hold.
 * If released earlier (and not moved), fires `onClick` instead.
 */
export function useLongPress({ delay = 2000, onLongPress, onClick }: Options) {
  const timerRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    triggeredRef.current = false;
    clear();
    timerRef.current = window.setTimeout(() => {
      triggeredRef.current = true;
      onLongPress();
    }, delay);
  }, [clear, delay, onLongPress]);

  const end = useCallback(() => {
    clear();
    if (!triggeredRef.current && onClick) onClick();
  }, [clear, onClick]);

  const cancel = useCallback(() => {
    clear();
    triggeredRef.current = false;
  }, [clear]);

  return {
    onPointerDown: start,
    onPointerUp: end,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  };
}
