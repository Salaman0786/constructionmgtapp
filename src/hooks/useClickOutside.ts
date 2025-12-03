import { useEffect } from "react";

export default function useClickOutside(
  ref: any,
  callback: () => void,
  ignoreRefs: any[] = []
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const isIgnored = ignoreRefs.some(
        (ignoreRef) =>
          ignoreRef.current && ignoreRef.current.contains(event.target)
      );

      if (isIgnored) return;

      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback, ignoreRefs]);
}
