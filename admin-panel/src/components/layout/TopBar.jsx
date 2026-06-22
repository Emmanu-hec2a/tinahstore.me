import React, { useContext, useState } from 'react';
import { Menu, Bell, ShoppingBag, X } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const TopBar = ({ title, onMenuOpen }) => {
  const { notifications, pendingCount } = useContext(AdminContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-[78px] bg-surface border-b border-neutral-200 sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-2 text-neutral-500 hover:bg-neutral-50 rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
      </div>

      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`p-2 rounded-full transition-all relative ${showDropdown ? 'bg-cyan-50 text-cyan-500' : 'text-neutral-400 hover:text-cyan-500 hover:bg-cyan-50'}`}
        >
          <Bell size={20} />
          {pendingCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border-2 border-surface rounded-full animate-ping"></span>
          )}
          {pendingCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border-2 border-surface rounded-full"></span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-card shadow-xl border border-neutral-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-neutral-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">New Orders</h3>
              <button onClick={() => setShowDropdown(false)} className="text-neutral-400 hover:text-neutral-600"><X size={16}/></button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-neutral-400">No new notifications</p>
                </div>
              ) : (
                notifications.map((order) => (
                  <Link
                    key={order.order_number}
                    to={`/orders/${order.order_number}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-start gap-4 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
                  >
                    <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                      <ShoppingBag size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">{order.customer_name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Order {order.order_number}</p>
                      <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <Link to="/orders" onClick={() => setShowDropdown(false)} className="block p-3 text-center text-xs font-bold text-cyan-600 bg-neutral-50 hover:bg-neutral-100 transition-colors">
                View all orders
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
