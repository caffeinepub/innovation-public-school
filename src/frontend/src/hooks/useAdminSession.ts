import { useState, useEffect } from 'react';

const ADMIN_SESSION_KEY = 'admin_session_token';

interface AdminSession {
  token: string;
  expiresAt: number;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) return null;
    
    try {
      const parsed = JSON.parse(stored) as AdminSession;
      // Check if expired
      if (parsed.expiresAt < Date.now()) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
  });

  const setAdminSession = (token: string, expiresIn: number = 24 * 60 * 60 * 1000) => {
    const newSession: AdminSession = {
      token,
      expiresAt: Date.now() + expiresIn,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  const clearAdminSession = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setSession(null);
  };

  const getSessionToken = (): string | null => {
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      clearAdminSession();
      return null;
    }
    return session.token;
  };

  const isSessionValid = (): boolean => {
    return !!session && session.expiresAt > Date.now();
  };

  return {
    session,
    setAdminSession,
    clearAdminSession,
    getSessionToken,
    isSessionValid,
  };
}
