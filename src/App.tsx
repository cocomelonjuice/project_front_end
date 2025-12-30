import { BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { Routers } from './shared/routes/src';
import { AuthProvider } from './shared/auth/src';
import Layout from './components/Layout';
import { privateRoutes, publicRoutes } from './app/routes';
import { useSelectorAuth } from './features/auth/src/store';

/**
 * Protected Route Wrapper
 * Redirects to login if not authenticated
 */
const ProtectedRoutes = () => {
  const authState = useSelectorAuth((state) => state);
  const location = useLocation();
  const token = localStorage.getItem('token');

  // If not authenticated and not on login/register page, redirect to login
  if (!token && !authState.isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login/register page, redirect to home
  if (token && authState.isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/" replace />;
  }

  return <Routers routes={privateRoutes} />;
};

/**
 * Public Routes Wrapper
 * Shows login/register pages without layout
 */
const PublicRoutes = () => {
  return <Routers routes={publicRoutes} />;
};

/**
 * App Content Component
 * Conditionally renders Layout based on route
 */
const AppContent = () => {
  const location = useLocation();
  const authState = useSelectorAuth((state) => state);
  const token = localStorage.getItem('token');
  const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';

  // Show public routes (login/register) without layout
  if (isPublicRoute && !token && !authState.isAuthenticated) {
    return <PublicRoutes />;
  }

  // Show private routes with layout
  return (
    <Layout>
      <ProtectedRoutes />
    </Layout>
  );
};

/**
 * Main App Component
 * Similar to vaccine-rsa-web-v2 portal app structure
 * 
 * Features:
 * - Permission-aware routing
 * - Role-based access control
 * - Auth provider for permission checking
 */
function App() {
  return (
    <Provider store={store}>
      <Router>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </PersistGate>
      </Router>
    </Provider>
  );
}

export default App;
