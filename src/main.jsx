import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// CSS imports
import './index.css';

// Router configuration
import { router } from './routes';

// Authentication provider
import { AuthProvider } from './context/AuthContext';

// i18n configuration
import './utils/i18n';

const App = () => {
  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<App />);
