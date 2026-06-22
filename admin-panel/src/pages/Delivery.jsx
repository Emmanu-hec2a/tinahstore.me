import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import DataTable from '../components/ui/DataTable';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Truck, CheckCircle, Package, Clock, UserCheck } from 'lucide-react';
import { ordersService } from '../services/orders';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const Delivery = () => {
  const [tab, setTab] = useState('confirmed'); // or 'shipped'
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const data = await ordersService.list({ status: tab });
      setOrders(data.results || data);
    } catch (err) {
      toast.error('Failed to load delivery queue');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 60000);
    return () => clearInterval(interval);
  }, [tab]);

  const handleStatusUpdate = async () => {
    try {
        if (tab === 'confirmed') {
            await ordersService.updateStatus(selectedOrder.order_number, 'shipped');
            toast.success('Order dispatched');
        } else {
            await ordersService.markDelivered(selectedOrder.order_number);
            toast.success('Order delivered & balance collected');
        }
        fetchOrders();
    } catch (err) {
        toast.error('Operation failed');
    } finally {
        setConfirmOpen(false);
        setSelectedOrder(null);
    }
  };

  const columns = [
    { header: 'Order #', accessor: 'order_number', className: 'font-mono font-bold text-cyan-600' },
    {
        header: 'Customer',
        render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-neutral-900">{row.customer_name}</span>
                <span className="text-xs text-neutral-400">{row.customer_phone}</span>
            </div>
        )
    },
    { header: 'City', accessor: 'city' },
    {
        header: 'Address',
        accessor: 'delivery_address',
        className: 'max-w-[200px] truncate text-xs text-neutral-500'
    },
    {
        header: 'Balance',
        render: (row) => `KSh ${Number(row.balance_amount).toLocaleString()}`,
        className: 'font-mono text-orange-600 font-bold'
    },
    {
        header: 'Confirmed Date',
        render: (row) => {
            if (!row.updated_at) return '—';
            try {
                const date = new Date(row.updated_at);
                if (isNaN(date.getTime())) return '—';
                return format(date, 'MMM dd, HH:mm');
            } catch (e) {
                return '—';
            }
        }
    },
    {
      header: 'Action',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={() => { setSelectedOrder(row); setConfirmOpen(true); }}
          className={`btn btn-sm gap-2 ${tab === 'confirmed' ? 'btn-primary' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          {tab === 'confirmed' ? <Package size={14} /> : <UserCheck size={14} />}
          {tab === 'confirmed' ? 'Mark Shipped' : 'Mark Delivered'}
        </button>
      )
    }
  ];

  return (
    <AdminLayout title="Delivery Management">
      <div className="space-y-8">
        {/* Chips */}
        <div className="flex flex-wrap gap-4">
            <div className="flex-1 bg-white p-4 rounded-card border-l-4 border-cyan-500 shadow-sm">
                <p className="text-xs text-neutral-400 uppercase font-bold mb-1">To Dispatch</p>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-neutral-900">{tab === 'confirmed' ? orders.length : '-'}</p>
                    <Package size={24} className="text-neutral-200" />
                </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-card border-l-4 border-teal-500 shadow-sm">
                <p className="text-xs text-neutral-400 uppercase font-bold mb-1">In Transit</p>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-neutral-900">{tab === 'shipped' ? orders.length : '-'}</p>
                    <Truck size={24} className="text-neutral-200" />
                </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-card border-l-4 border-green-500 shadow-sm">
                <p className="text-xs text-neutral-400 uppercase font-bold mb-1">Delivered Today</p>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-neutral-900">-</p>
                    <CheckCircle size={24} className="text-neutral-200" />
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="card !p-0 overflow-hidden">
            <div className="flex border-b border-neutral-100">
                <button
                    onClick={() => setTab('confirmed')}
                    className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'confirmed' ? 'text-cyan-600 bg-cyan-50/50 border-b-2 border-cyan-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                    Awaiting Dispatch
                </button>
                <button
                    onClick={() => setTab('shipped')}
                    className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'shipped' ? 'text-teal-600 bg-teal-50/50 border-b-2 border-teal-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                    In Transit (Shipped)
                </button>
            </div>
            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={orders}
                    isLoading={isLoading}
                    emptyMessage={tab === 'confirmed' ? "Queue is empty. No orders confirmed for dispatch." : "No orders currently in transit."}
                />
            </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={tab === 'confirmed' ? 'Mark as Shipped?' : 'Confirm Delivery?'}
        message={tab === 'confirmed' ? `Set order ${selectedOrder?.order_number} status to Shipped? This tells the customer the bag is on its way.` : `Confirm delivery for ${selectedOrder?.order_number}? This will also mark the KSh ${selectedOrder?.balance_amount} balance as collected.`}
        onConfirm={handleStatusUpdate}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminLayout>
  );
};

export default Delivery;
