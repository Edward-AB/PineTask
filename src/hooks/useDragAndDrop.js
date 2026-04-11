import { useState, useCallback } from 'react';

export default function useDragAndDrop() {
  const [dragging, setDragging] = useState(null);

  const startDrag = useCallback((taskId, source) => {
    setDragging({ taskId, source });
  }, []);

  const endDrag = useCallback(() => {
    setDragging(null);
  }, []);

  return {
    dragging,
    startDrag,
    endDrag,
  };
}
