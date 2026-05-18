import { createContext, useContext, useState, useEffect } from 'react';
import { BackendService } from '../services/BackendService';
import { AuthService } from '../services/AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const authBackend = new BackendService(API_BASE_URL);
const authService = new AuthService(authBackend);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(req) {
    const u = await authService.login(req);
    setUser(u);
    return u;
  }

  async function register(req) {
    const u = await authService.register(req);
    setUser(u);
    return u;
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
