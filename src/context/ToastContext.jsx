import { createContext, useState, useCallback } from 'react';
import Toast from '../components/shared/Toast.jsx';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={dismiss} />}
    </ToastContext.Provider>
  );
}
