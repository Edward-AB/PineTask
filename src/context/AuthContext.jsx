import { createContext, useState, useEffect, useCallback } from 'react';
import { apiGet, setToken as storeToken, clearToken, getUsernameFromToken, getUserIdFromToken } from '../api/client.js';
import { TOKEN_KEY } from '../constants';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiGet('/api/auth/me');
      setUser(data.data || data);
    } catch {
      clearToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = useCallback((token) => {
    storeToken(token);
    loadUser();
  }, [loadUser]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
