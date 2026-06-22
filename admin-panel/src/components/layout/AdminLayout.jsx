import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-[240px] flex flex-col min-h-screen">
        <TopBar title={title} onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
