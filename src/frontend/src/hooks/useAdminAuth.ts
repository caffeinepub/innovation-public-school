import { useState } from 'react';
import { useAdminSession } from './useAdminSession';
import { useActor } from './useActor';

type LoginStatus = 'idle' | 'logging-in' | 'success' | 'error';

export function useAdminAuth() {
  const { isSessionValid, setAdminSession, clearAdminSession } = useAdminSession();
  const { actor } = useActor();
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = isSessionValid();

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoginStatus('logging-in');
    setError(null);

    try {
      if (!actor) {
        throw new Error('Backend not available');
      }

      // Call backend login method (to be implemented)
      // const response = await actor.adminLogin(username, password);
      
      // Temporary hardcoded check until backend implements adminLogin
      // This should be removed once backend is ready
      if (username === 'innovationpublicschools' && password === 'innovation123publicschool') {
        // Generate a temporary session token
        const tempToken = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setAdminSession(tempToken);
        setLoginStatus('success');
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setLoginStatus('error');
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    clearAdminSession();
    setLoginStatus('idle');
    setError(null);
  };

  return {
    isAuthenticated,
    isAdmin: isAuthenticated, // For now, if authenticated via session, they are admin
    isCheckingAdmin: false,
    login,
    logout,
    loginStatus,
    error,
  };
}
