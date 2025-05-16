import { useState, useEffect, createContext, useContext } from 'react';
import { settingsRepository, getDatabase } from '../lib/database';
import { useLocation } from 'react-router-dom';

// Type for theme options
type ThemeOption = 'light' | 'dark' | 'system';

// Context interfaces
interface ThemeContextType {
  theme: ThemeOption;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeOption) => void;
  toggleTheme: () => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  effectiveTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

// Get system preference
const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Theme provider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeOption>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(getSystemTheme());
  const [userId, setUserId] = useState<number | null>(null);
  const location = useLocation();

  // Load theme from localStorage when component mounts
  useEffect(() => {
    // First check localStorage for quick initial render
    const storedTheme = localStorage.getItem('theme') as ThemeOption;
    if (storedTheme) {
      setThemeState(storedTheme);
    }

    // Then check if user is logged in
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserId(user.id);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  // Load theme from database if user is logged in
  useEffect(() => {
    if (userId) {
      try {
        // Ensure database is initialized
        if (!getDatabase()) {
          return;
        }
        
        const userSettings = settingsRepository.getSettings(userId);
        if (userSettings && userSettings.theme) {
          setThemeState(userSettings.theme as ThemeOption);
          localStorage.setItem('theme', userSettings.theme);
        }
      } catch (e) {
        console.error('Failed to load theme from database', e);
      }
    }
  }, [userId]);

  // Update theme when user logs in/out (path changes)
  useEffect(() => {
    // If path changes to login or register, check again for user
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/dashboard') {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          setUserId(user.id);
        } catch (e) {
          console.error('Failed to parse user from localStorage', e);
        }
      } else if (location.pathname === '/login' || location.pathname === '/register') {
        // User logged out, use localStorage theme
        const storedTheme = localStorage.getItem('theme') as ThemeOption;
        if (storedTheme) {
          setThemeState(storedTheme);
        } else {
          setThemeState('system');
        }
      }
    }
  }, [location.pathname]);

  // Calculate effective theme
  useEffect(() => {
    if (theme === 'system') {
      setEffectiveTheme(getSystemTheme());
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setEffectiveTheme(getSystemTheme());
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Set theme function
  const setTheme = (newTheme: ThemeOption) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // If user is logged in, save to database
    if (userId) {
      try {
        if (getDatabase()) {
          settingsRepository.updateSettings(userId, { theme: newTheme });
        }
      } catch (e) {
        console.error('Failed to save theme to database', e);
      }
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};