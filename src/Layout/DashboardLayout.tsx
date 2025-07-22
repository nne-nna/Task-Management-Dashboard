import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const location = useLocation(); 

  const currentSearchParams = new URLSearchParams(location.search);
  const currentFilter = (currentSearchParams.get('filter') || 'all') as 'all' | 'pending' | 'completed' | 'overdue';

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeFilter={currentFilter}
      />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
