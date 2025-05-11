import React from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import {
  LayoutDashboard,
  CalendarClock,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../config';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  // Map icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard size={20} />,
    CalendarClock: <CalendarClock size={20} />,
    MessageSquare: <MessageSquare size={20} />,
    Users: <Users size={20} />,
    Settings: <Settings size={20} />,
    Home: <Home size={20} />
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={twMerge(
          'fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-blue-600">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                  <path d="M12 6L16 8.5V13.5L12 16L8 13.5V8.5L12 6Z" fill="white" stroke="white" strokeWidth="1" />
                </svg>
              </span>
              <span className="ml-2 text-xl font-semibold text-gray-900">InstaPark</span>
            </div>
            
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      twMerge(
                        'flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      )
                    }
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className="mr-3">{iconMap[item.icon]}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;