import React, { createContext, useContext, useMemo, useRef, useState, useCallback } from 'react';
import { refreshAccess, apiClient, getProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Keep token in memory (clears on full page reload by design)
  const accessRef = useRef(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileUpdatedAt, setProfileUpdatedAt] = useState(null);

  // Attach Authorization header automatically when token present
  // (simple approach: rely on request interceptor)
  apiClient.interceptors.request.use((config) => {
    if (accessRef.current) config.headers.Authorization = `Bearer ${accessRef.current}`;
    return config;
  });

  const refreshProfile = useCallback(async () => {
    if (!accessRef.current) {
      setProfile(null);
      setIsProfileLoading(false);
      setProfileUpdatedAt(null);
      return null;
    }
    setIsProfileLoading(true);
    try {
      const data = await getProfile(accessRef.current);
      setProfile(data);
      setProfileUpdatedAt(new Date());
      return data;
    } catch (err) {
      setProfile(null);
      setProfileUpdatedAt(null);
      throw err;
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    isAuthenticated: !!accessRef.current,
    setSession: ({ access, user }) => {
      accessRef.current = access || null;
      setUser(user || null);
      if (access) {
        refreshProfile().catch(() => {});
      } else {
        setProfile(null);
        setProfileUpdatedAt(null);
        setIsProfileLoading(false);
      }
    },
    clearSession: () => {
      accessRef.current = null;
      setUser(null);
      setProfile(null);
      setIsProfileLoading(false);
      setProfileUpdatedAt(null);
    },
    getAccessToken: () => accessRef.current,
    // optional cookie-based refresh flow
    tryRefresh: async () => {
      try {
        const data = await refreshAccess();
        accessRef.current = data?.access || null;
        if (accessRef.current) {
          await refreshProfile().catch(() => {});
        } else {
          setProfile(null);
          setIsProfileLoading(false);
          setProfileUpdatedAt(null);
        }
        return !!accessRef.current;
      } catch {
        accessRef.current = null;
        setUser(null);
        setProfile(null);
        setIsProfileLoading(false);
        setProfileUpdatedAt(null);
        return false;
      }
    },
    refreshProfile,
    isProfileLoading,
    setProfile,
    profileUpdatedAt,
    setProfileUpdatedAt,
  }), [user, profile, refreshProfile, isProfileLoading, profileUpdatedAt]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
