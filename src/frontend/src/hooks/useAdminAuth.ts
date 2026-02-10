import { useAdminSession } from './useAdminSession';
import { useActor } from './useActor';

/**
 * Admin authentication hook using token-based session management
 */
export function useAdminAuth() {
  const { token, isValid, isValidating, validationError, login, logout, retryValidation } = useAdminSession();
  const { isFetching: actorFetching } = useActor();

  const isAuthenticated = isValid && !!token;
  
  // Only show "checking auth" when:
  // 1. Actor is still initializing AND we have a token to validate, OR
  // 2. We're actively validating a token
  const isCheckingAuth = (actorFetching && !!token) || isValidating;

  return {
    isAuthenticated,
    isCheckingAuth,
    validationError,
    login,
    logout,
    retryValidation,
  };
}
