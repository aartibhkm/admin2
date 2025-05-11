import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get current page title based on location
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/bookings')) return 'Booking Management';
    if (path.includes('/contacts')) return 'Contact Messages';
    if (path.includes('/admins')) return 'Admin Management';
    if (path.includes('/settings')) return 'Settings';
    
    return 'Dashboard';
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getPageTitle()} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;