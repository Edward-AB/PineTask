import { useState, useEffect, useRef, useCallback } from 'react';

export default function useCelebration(tasks) {
  const [celebrating, setCelebrating] = useState(false);
  const hasCelebrated = useRef(false);

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      hasCelebrated.current = false;
      return;
    }

    const allDone = tasks.every((t) => t.done);

    if (allDone && !hasCelebrated.current) {
      hasCelebrated.current = true;
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [tasks]);

  const dismiss = useCallback(() => {
    setCelebrating(false);
  }, []);

  return {
    celebrating,
    dismiss,
  };
}
