import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define shape of auth context state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage or API on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Replace this with your real auth API call
      if (username === 'admin' && password === 'password') {
        const fakeUser = { id: '1', username: 'admin', email: 'admin@example.com' };
        setUser(fakeUser);
        localStorage.setItem('user', JSON.stringify(fakeUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext more easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};