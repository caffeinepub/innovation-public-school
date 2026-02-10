import { useState, useEffect, useCallback } from 'react';
import { useActor } from './useActor';
import { getErrorMessage } from '../utils/errorMessage';
import { adminSessionStore } from './adminSessionStore';

export type ValidationError = {
  type: 'invalid' | 'backend-unavailable' | 'network';
  message: string;
};

/**
 * Hook for managing admin session tokens with sessionStorage persistence
 * Uses shared store to keep all instances synchronized
 */
export function useAdminSession() {
  const { actor } = useActor();
  const [token, setToken] = useState<string | null>(() => adminSessionStore.getToken());
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = adminSessionStore.subscribe(() => {
      setToken(adminSessionStore.getToken());
    });
    return unsubscribe;
  }, []);

  // Validate token when token or actor changes
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        setValidationError(null);
        return;
      }

      if (!actor) {
        // Don't validate yet if actor isn't ready
        return;
      }

      setIsValidating(true);
      setValidationError(null);

      try {
        const valid = await actor.validateAdminSession(token);
        setIsValid(valid);
        
        if (!valid) {
          // Clear invalid/expired token
          adminSessionStore.setToken(null);
          setValidationError({
            type: 'invalid',
            message: 'Your session has expired. Please log in again.',
          });
        }
      } catch (error) {
        setIsValid(false);
        
        // Determine error type
        const errorMsg = getErrorMessage(error);
        const lowerMsg = errorMsg.toLowerCase();
        
        if (lowerMsg.includes('backend') || lowerMsg.includes('service') || lowerMsg.includes('canister')) {
          // Backend unavailable - keep token, allow retry
          setValidationError({
            type: 'backend-unavailable',
            message: 'Backend service is temporarily unavailable. Please try again.',
          });
        } else if (lowerMsg.includes('network') || lowerMsg.includes('connection')) {
          // Network error - keep token, allow retry
          setValidationError({
            type: 'network',
            message: 'Network error. Please check your connection and try again.',
          });
        } else {
          // Invalid token or other error - clear token
          adminSessionStore.setToken(null);
          setValidationError({
            type: 'invalid',
            message: 'Your session is invalid. Please log in again.',
          });
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, actor]);

  const login = async (username: string, password: string): Promise<void> => {
    if (!actor) {
      throw new Error('Backend service is not available. Please try again in a moment.');
    }

    try {
      const newToken = await actor.adminLogin(username, password);
      if (!newToken || newToken.trim() === '') {
        throw new Error('Invalid credentials');
      }
      
      // Store token in shared store (persists to sessionStorage)
      adminSessionStore.setToken(newToken);
      setIsValid(true);
      setValidationError(null);
    } catch (error) {
      // Use sanitized error message that doesn't leak credentials
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async (): Promise<void> => {
    const currentToken = adminSessionStore.getToken();
    
    // Clear local state immediately
    adminSessionStore.setToken(null);
    setIsValid(false);
    setValidationError(null);

    if (!actor || !currentToken) {
      return;
    }

    try {
      await actor.adminLogout(currentToken);
    } catch (error) {
      // Ignore logout errors - local state already cleared
      console.error('Logout request failed (ignored)');
    }
  };

  const retryValidation = useCallback(() => {
    // Force re-validation by triggering the effect
    const currentToken = adminSessionStore.getToken();
    if (currentToken && actor) {
      setValidationError(null);
      setToken(currentToken);
    }
  }, [actor]);

  return {
    token,
    isValid,
    isValidating,
    validationError,
    login,
    logout,
    retryValidation,
  };
}
