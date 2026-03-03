import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PortalProvider } from './contexts/PortalContext';
import { CartProvider } from './contexts/CartContext';
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
import PrinterOrdersPage from './pages/PrinterOrdersPage';
import PrinterOrderDetailPage from './pages/PrinterOrderDetailPage';
import AgentControlCenterPage from './pages/AgentControlCenterPage';
import AgentTaskDetailPage from './pages/AgentTaskDetailPage';
import StripeOnboardingPage from './pages/StripeOnboardingPage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import SettingsLayout from './pages/settings/SettingsLayout';
import TeamPage from './pages/settings/TeamPage';
import NotificationsPage from './pages/settings/NotificationsPage';
import IntegrationsPage from './pages/settings/IntegrationsPage';
import PortalHomePage from './pages/portal/PortalHomePage';
import PortalCatalogPage from './pages/portal/PortalCatalogPage';
import PortalProductDetailPage from './pages/portal/PortalProductDetailPage';
import CartPage from './pages/portal/CartPage';
import CheckoutPage from './pages/portal/CheckoutPage';
import OrderConfirmationPage from './pages/portal/OrderConfirmationPage';
import MyOrdersPage from './pages/portal/MyOrdersPage';
import OrderDetailPage from './pages/portal/OrderDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/invite/:token" element={<AcceptInvitationPage />} />
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
          {/* Printer admin order routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PrinterOrdersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PrinterOrderDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* Agent Control Center */}
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AgentControlCenterPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents/:taskId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AgentTaskDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* Settings hub */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsLayout />
                </AppLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/settings/team" replace />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="stripe" element={<StripeOnboardingPage />} />
          </Route>
          {/* Public portal routes */}
          <Route
            path="/p/:slug"
            element={
              <PortalProvider>
                <CartProvider>
                  <PortalLayout />
                </CartProvider>
              </PortalProvider>
            }
          >
            <Route index element={<PortalHomePage />} />
            <Route path="products" element={<PortalCatalogPage />} />
            <Route path="products/:productId" element={<PortalProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders/:orderId/confirmation" element={<OrderConfirmationPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
