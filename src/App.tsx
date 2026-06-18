import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ToastProvider } from './lib/toast';
import { usePWAUpdate } from './lib/pwaUpdate';
import PWAUpdatePrompt from './components/UI/PWAUpdatePrompt';
import ManagerLayout from './components/Layout/ManagerLayout';
import LoginPage from './pages/manager/LoginPage';
import DashboardPage from './pages/manager/DashboardPage';
import OrdersPage from './pages/manager/OrdersPage';
import MenuPage from './pages/manager/MenuPage';
import TablesPage from './pages/manager/TablesPage';
import StaffPage from './pages/manager/StaffPage';
import SettingsPage from './pages/manager/SettingsPage';
// test uchun yozyapman
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { user, loadProfile } = useAuthStore();
  const { needRefresh, updateApp, closePrompt } = usePWAUpdate();

  useEffect(() => {
    console.log('🚀 App mounted, loading profile...');
    loadProfile();
  }, []); // Empty dependency array - run only once on mount

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/manager" replace /> : <LoginPage />} />
          
          <Route path="/manager" element={<ProtectedRoute><ManagerLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/manager" replace />} />
        </Routes>
        
        {/* PWA Update Prompt */}
        <PWAUpdatePrompt
          show={needRefresh}
          onUpdate={updateApp}
          onClose={closePrompt}
        />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
