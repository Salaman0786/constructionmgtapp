import { useEffect } from "react";

type Options = {
  buttonSelector?: string;
  menuSelector?: string;
  onOutsideClick: () => void;
  enabled?: boolean;
};

export function useActionMenuOutside({
  buttonSelector = "[data-action-button]",
  menuSelector = "[data-action-menu]",
  onOutsideClick,
  enabled = true,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.closest(buttonSelector) ||
        target.closest(menuSelector)
      ) {
        return;
      }

      onOutsideClick();
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () =>
      document.removeEventListener("mousedown", handleDocumentClick);
  }, [buttonSelector, menuSelector, onOutsideClick, enabled]);
}
