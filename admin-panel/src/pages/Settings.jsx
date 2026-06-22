import React, { useState, useContext } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Store, ShieldCheck, User, Save, Bell } from 'lucide-react';
import { authService } from '../services/auth';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user } = useContext(AdminContext);
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });
  const [isChanging, setChanging] = useState(false);

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
        toast.error('New passwords do not match');
        return;
    }
    setChanging(true);
    try {
        await authService.changePassword(passData.old, passData.new);
        toast.success('Password updated successfully');
        setPassData({ old: '', new: '', confirm: '' });
    } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally {
        setChanging(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            {/* Store Config */}
            <div className="card space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                    <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                        <Store size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Store Configuration</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-50">
                        <span className="text-sm text-neutral-500">Deposit Percentage</span>
                        <span className="font-bold text-neutral-900">60%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-50">
                        <span className="text-sm text-neutral-500">Flat Delivery Fee</span>
                        <span className="font-bold text-neutral-900">KSh 250</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-neutral-500">Free Delivery Threshold</span>
                        <span className="font-bold text-neutral-900">KSh 5,000</span>
                    </div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-md flex gap-3">
                    <Bell size={16} className="text-neutral-400 mt-0.5" />
                    <p className="text-xs text-neutral-500 leading-relaxed">
                        These settings are configured at the system level. Contact your developer to change business logic parameters.
                    </p>
                </div>
            </div>

            {/* Admin Info */}
            <div className="card space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <User size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Account Information</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="label">Username</label>
                        <p className="text-md font-semibold text-neutral-900">{user?.username || 'admin'}</p>
                    </div>
                    <div>
                        <label className="label">Email Address</label>
                        <p className="text-sm text-neutral-600">admin@tinahstore.co.ke</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            {/* Security */}
            <div className="card space-y-6">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Security & Password</h3>
                </div>
                <form onSubmit={handlePassChange} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="label">Current Password</label>
                        <input
                            type="password" required className="input"
                            value={passData.old} onChange={(e) => setPassData({ ...passData, old: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="label">New Password</label>
                        <input
                            type="password" required className="input"
                            value={passData.new} onChange={(e) => setPassData({ ...passData, new: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="label">Confirm New Password</label>
                        <input
                            type="password" required className="input"
                            value={passData.confirm} onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={isChanging} className="btn btn-primary w-full gap-2 mt-4">
                        <Save size={18} />
                        {isChanging ? 'Updating Password...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
