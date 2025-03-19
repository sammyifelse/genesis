import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const [token, setToken] = useState<string | null>(storedToken);

  const login = (newToken: string, rememberMe = false) => {
    setToken(newToken);
    if (rememberMe) {
      localStorage.setItem('token', newToken); // Persistent storage
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', newToken); // Temporary storage
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
