import { useEffect, useState, useRef } from 'react';

export const useThrottle = <T>(value: T, delay: number = 500): T => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastExecuted.current;

    if( timeElapsed >= delay ) {
        setThrottledValue(value);
        lastExecuted.current = now;
    } else {
        const timer = setTimeout(() => {
            setThrottledValue(value);
            lastExecuted.current = Date.now();
        }, delay - timeElapsed);

        return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};
