import { useState, useCallback, useEffect, useRef } from 'react';

export default function useTimer() {
  const [timerState, setTimerState] = useState(null);
  const intervalRef = useRef(null);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTimerState((prev) => {
      if (!prev || prev.state !== 'running') return prev;
      const remaining = prev.remaining - 1;
      if (remaining <= 0) {
        return { ...prev, remaining: 0, state: 'done' };
      }
      return { ...prev, remaining };
    });
  }, []);

  useEffect(() => {
    clearInterval_();
    if (timerState && timerState.state === 'running') {
      intervalRef.current = setInterval(tick, 1000);
    }
    return clearInterval_;
  }, [timerState?.state, tick, clearInterval_]);

  const startTimer = useCallback((minutes) => {
    const total = minutes * 60;
    setTimerState({ total, remaining: total, state: 'running' });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => (prev ? { ...prev, state: 'paused' } : prev));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerState((prev) => (prev ? { ...prev, state: 'running' } : prev));
  }, []);

  const cancelTimer = useCallback(() => {
    setTimerState(null);
  }, []);

  const addTime = useCallback((seconds) => {
    setTimerState((prev) =>
      prev ? { ...prev, remaining: prev.remaining + seconds } : prev
    );
  }, []);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    addTime,
  };
}
