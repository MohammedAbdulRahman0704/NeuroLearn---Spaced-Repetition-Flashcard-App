import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DecksPage from './pages/DecksPage';
import DeckDetailPage from './pages/DeckDetailPage';
import ReviewPage from './pages/ReviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Add the theme to the HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Remove the initial render flag after first render
  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (!isInitialRender) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isInitialRender]);

  return (
    <Routes>
      {/* Public routes */}
      <Route index element={<LandingPage />} />
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/decks/:deckId" element={<DeckDetailPage />} />
        <Route path="/review/:deckId" element={<ReviewPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      
      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;