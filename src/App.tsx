import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';
import ContactsPage from './pages/ContactsPage';
import AdminsPage from './pages/AdminsPage';
import SettingsPage from './pages/SettingsPage';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Root App component
const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;