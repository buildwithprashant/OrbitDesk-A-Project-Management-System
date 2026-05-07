import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';

const AuthContext = createContext(null);
const storageKey = 'orbitdesk_user';
const tokenKey = 'orbitdesk_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(storageKey);
    return cached ? JSON.parse(cached) : null;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      setBooting(false);
      return;
    }

    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem(storageKey, JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(storageKey);
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem(storageKey, JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}`);
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem(storageKey, JSON.stringify(data.user));
    setUser(data.user);
    toast.success('Workspace account created');
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(storageKey);
    setUser(null);
    toast.success('Signed out');
  };

  const updateUser = (nextUser) => {
    localStorage.setItem(storageKey, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      login,
      signup,
      logout,
      updateUser,
      isAdmin: user?.role === 'admin',
      canManageWork: ['manager', 'admin'].includes(user?.role)
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
