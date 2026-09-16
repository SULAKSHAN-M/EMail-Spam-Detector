import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Account from './pages/Account';
import Settings from './pages/Settings';
import { EmailProvider } from './context/EmailContext';
import { applySettings } from './hooks/useSettings';

// Defined outside App to avoid recreation on every render
function ProtectedRoute({ children, isAuthenticated, isLoading }) {
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/home" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    applySettings();
  }, []);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('jwt', tokenFromUrl);
      setSearchParams({}, { replace: true });
    }

    const token = tokenFromUrl || localStorage.getItem('jwt');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URI}/auth/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setIsAuthenticated(!!d.authenticated))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line

  const Guard = ({ children }) => (
    <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
      {children}
    </ProtectedRoute>
  );

  return (
    <EmailProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/"
          element={
            <Guard>
              <Dashboard />
            </Guard>
          }
        />
        <Route
          path="/results"
          element={
            <Guard>
              <Results />
            </Guard>
          }
        />
        <Route
          path="/account"
          element={
            <Guard>
              <Account />
            </Guard>
          }
        />
        <Route
          path="/settings"
          element={
            <Guard>
              <Settings />
            </Guard>
          }
        />
      </Routes>
    </EmailProvider>
  );
}

export default App;
