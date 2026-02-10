/**
 * Shared admin session store with sessionStorage persistence
 * Ensures all useAdminSession callers stay synchronized
 */

const ADMIN_TOKEN_KEY = 'admin_session_token';

type Listener = () => void;

class AdminSessionStore {
  private token: string | null = null;
  private listeners: Set<Listener> = new Set();

  constructor() {
    // Restore token from sessionStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
    
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      }
    }
    
    this.notifyListeners();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const adminSessionStore = new AdminSessionStore();
