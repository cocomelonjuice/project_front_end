import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Routers } from './shared/routes/src';
import { AuthProvider } from './shared/auth/src';
import Layout from './components/Layout';
import { privateRoutes } from './app/routes';

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
        <AuthProvider>
          <Layout>
            <Routers routes={privateRoutes} />
          </Layout>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
