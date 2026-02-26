import { useCallback, useRef } from 'react';

/**
 * A React hook that returns a callback function which logs a message only once,
 * even if called multiple times. Useful for debugging scenarios where you want
 * to log initialization or setup messages without spamming the console.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const logInit = useLogOnce('init', 'Component initialized', { timestamp: Date.now() });
 *
 *   useEffect(() => {
 *     logInit(); // Logs only on first call
 *     logInit(); // No-op, already logged
 *   }, [logInit]);
 *
 *   return <div>My Component</div>;
 * }
 * ```
 *
 * @param key - A unique identifier for this log instance. Used as a dependency
 *              in the useCallback hook to control when the callback is recreated.
 * @param message - The message string to log to the console.
 * @param object - Optional object or value to log alongside the message.
 * @returns A memoized callback function that logs the message only once when called.
 *          Subsequent calls to the returned function will be no-ops.
 */
export function useLogOnce(key: string, message: string) {
  const hasLogged = useRef(false);

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...object: any[]) => {
      if (hasLogged.current) return;
      hasLogged.current = true;

      console.log(message, ...object);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, message]
  );
}
