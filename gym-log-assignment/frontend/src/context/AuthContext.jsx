import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { refreshAccess, apiClient } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Keep token in memory (clears on full page reload by design)
  const accessRef = useRef(null);
  const [user, setUser] = useState(null);

  // Attach Authorization header automatically when token present
  // (simple approach: rely on request interceptor)
  apiClient.interceptors.request.use((config) => {
    if (accessRef.current) config.headers.Authorization = `Bearer ${accessRef.current}`;
    return config;
  });

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!accessRef.current,
    setSession: ({ access, user }) => {
      accessRef.current = access || null;
      setUser(user || null);
    },
    clearSession: () => {
      accessRef.current = null;
      setUser(null);
    },
    getAccessToken: () => accessRef.current,
    // optional cookie-based refresh flow
    tryRefresh: async () => {
      try {
        const data = await refreshAccess();
        accessRef.current = data?.access || null;
        return !!accessRef.current;
      } catch {
        accessRef.current = null;
        setUser(null);
        return false;
      }
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
