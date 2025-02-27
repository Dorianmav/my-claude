import { useEffect, useCallback } from 'react';

interface ShortcutOptions {
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) => {
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === !!options.ctrlKey &&
        event.altKey === !!options.altKey &&
        event.shiftKey === !!options.shiftKey &&
        event.metaKey === !!options.metaKey
      ) {
        event.preventDefault();
        callback();
      }
    },
    [key, callback, options]
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
};
