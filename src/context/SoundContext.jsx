import { createContext, useState, useCallback } from 'react';

export const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const toggle = useCallback(() => setEnabled(e => !e), []);

  return (
    <SoundContext.Provider value={{ enabled, volume, setEnabled, setVolume, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}
