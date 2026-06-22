import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, FolderOpen,
  CreditCard, Truck, Settings, LogOut, User
} from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { pendingCount, user, logout } = useContext(AdminContext);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { type: 'divider' },
    { label: 'Orders', path: '/orders', icon: ShoppingBag, badge: pendingCount },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Categories', path: '/categories', icon: FolderOpen },
    { type: 'divider' },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Delivery', path: '/delivery', icon: Truck },
    { type: 'divider' },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-[240px] bg-teal-ink text-white/70 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="h-[78px] flex items-center px-6 gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold italic">T</div>
          <span className="text-lg font-bold text-white tracking-tight">Tinah<span className="text-cyan-400">Store</span> Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item, i) => {
            if (item.type === 'divider') {
              return <div key={i} className="h-px bg-white/5 my-4 mx-3"></div>;
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 768 && onClose()}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-cyan-500/10 text-white border-l-[3px] border-cyan-500 pl-[9px]'
                    : 'hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 bg-black/20 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none mb-1">{user?.username || 'Admin User'}</p>
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-neutral-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
