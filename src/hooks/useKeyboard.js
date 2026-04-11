import { useEffect } from 'react';

export default function useKeyboard(keyMap) {
  useEffect(() => {
    if (!keyMap) return;

    function handleKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const handler = keyMap[e.key];
      if (handler) {
        handler(e);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap]);
}
