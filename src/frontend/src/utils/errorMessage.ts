/**
 * Converts unknown error values into user-friendly English messages
 * Ensures no credentials or sensitive data are exposed
 */
export function getErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for invalid credentials - highest priority
    if (message.includes('invalid username') || message.includes('invalid password') || message.includes('invalid credentials')) {
      return 'Invalid username or password. Please try again.';
    }
    
    // Check for session/token errors
    if (message.includes('session') || message.includes('delegation') || message.includes('expired') || message.includes('invalid token')) {
      return 'Your session has expired. Please log in again.';
    }
    
    // Check for admin/authorization errors
    if (message.includes('unauthorized') || message.includes('not authorized')) {
      return 'You do not have permission to perform this action.';
    }
    
    // Check for authentication errors
    if (message.includes('authentication') || message.includes('login failed')) {
      return 'Authentication failed. Please try again.';
    }
    
    // Check for backend/actor availability
    if (message.includes('actor') || message.includes('backend') || message.includes('canister') || message.includes('service')) {
      return 'Backend service is not available. Please try again in a moment.';
    }
    
    // Check for network/connectivity errors
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Check for method not found errors
    if (message.includes('method') || message.includes('function') || message.includes('not found')) {
      return 'This feature is not available. Please contact support.';
    }
    
    // Return the original error message if it's user-friendly and doesn't contain trap text
    if (error.message && error.message.length < 200 && !message.includes('trap') && !message.includes('reject')) {
      return error.message;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('invalid username') || lowerError.includes('invalid password') || lowerError.includes('invalid credentials')) {
      return 'Invalid username or password. Please try again.';
    }
    
    if (lowerError.includes('session') || lowerError.includes('delegation') || lowerError.includes('expired') || lowerError.includes('invalid token')) {
      return 'Your session has expired. Please log in again.';
    }
    
    if (lowerError.includes('unauthorized') || lowerError.includes('not authorized')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (lowerError.includes('authentication') || lowerError.includes('login failed')) {
      return 'Authentication failed. Please try again.';
    }
    
    if (lowerError.includes('actor') || lowerError.includes('backend') || lowerError.includes('canister') || lowerError.includes('service')) {
      return 'Backend service is not available. Please try again in a moment.';
    }
    
    if (lowerError.includes('network') || lowerError.includes('fetch') || lowerError.includes('connection')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (lowerError.includes('method') || lowerError.includes('function') || lowerError.includes('not found')) {
      return 'This feature is not available. Please contact support.';
    }
    
    if (error.length < 200 && !lowerError.includes('trap') && !lowerError.includes('reject')) {
      return error;
    }
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
}
