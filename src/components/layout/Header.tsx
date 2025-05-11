import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </button>
            
            {showProfileMenu && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm leading-none text-gray-800 font-medium">{user?.username}</p>
                  <p className="text-xs leading-none text-gray-500 mt-1">{user?.email}</p>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;