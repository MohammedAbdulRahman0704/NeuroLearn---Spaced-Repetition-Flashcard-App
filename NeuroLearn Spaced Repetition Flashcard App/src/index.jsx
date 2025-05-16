import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './hooks/useTheme';

// Initialize the SQLite database
import { setupDatabase } from './lib/database';

// Initialize the database when the app starts
setupDatabase().catch(console.error);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
}