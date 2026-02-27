import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PortalProvider } from './contexts/PortalContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import PortalLayout from './components/layout/PortalLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GetStartedWizardPage from './pages/GetStartedWizardPage';
import PortalsListPage from './pages/PortalsListPage';
import CreatePortalPage from './pages/CreatePortalPage';
import PortalDetailPage from './pages/PortalDetailPage';
import ProductManagementPage from './pages/ProductManagementPage';
import PortalHomePage from './pages/portal/PortalHomePage';
import PortalCatalogPage from './pages/portal/PortalCatalogPage';
import PortalProductDetailPage from './pages/portal/PortalProductDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-started"
            element={
              <ProtectedRoute>
                <GetStartedWizardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portals"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PortalsListPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portals/create"
            element={
              <ProtectedRoute>
                <CreatePortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portals/:portalId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PortalDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portals/:portalId/products"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductManagementPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* Public portal routes (no auth) */}
          <Route
            path="/p/:slug"
            element={
              <PortalProvider>
                <PortalLayout />
              </PortalProvider>
            }
          >
            <Route index element={<PortalHomePage />} />
            <Route path="products" element={<PortalCatalogPage />} />
            <Route path="products/:productId" element={<PortalProductDetailPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
