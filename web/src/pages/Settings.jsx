import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Settings as SettingsIcon, Package, FileText, Shield, MapPin, CreditCard, Bell, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { deleteAccount } from '../features/auth/authSlice';

const tabs = [
  {
    to: '/saved-addresses',
    title: 'Saved Addresses',
    description: 'Manage Home, Work, and Other addresses',
    icon: MapPin,
    available: true,
  },
  {
    to: '/orders',
    title: 'My Orders',
    description: 'Track and manage your purchases',
    icon: Package,
    available: true,
  },
  {
    to: '/terms-and-conditions',
    title: 'Terms & Conditions',
    description: 'Read our service terms',
    icon: FileText,
    available: true,
  },
  {
    to: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'Understand how your data is used',
    icon: Shield,
    available: true,
  },
  {
    to: '#',
    title: 'Payment Methods',
    description: 'Store and manage payment options',
    icon: CreditCard,
    available: false,
  },
  {
    to: '#',
    title: 'Notifications',
    description: 'Control email and order alerts',
    icon: Bell,
    available: false,
  },
];

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAccount()).unwrap();
      navigate('/');
    } catch (error) {
      alert(error || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-7 h-7 text-[#d4af88]" />
          <h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">Settings</h1>
        </div>
        <p className="text-[#666666] text-lg">Manage your account tools, legal pages, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map((item) => {
          const Icon = item.icon;
          const cardClassName = item.available
            ? 'group border border-[#e8e8e8] hover:border-[#d4af88] p-4 transition bg-white'
            : 'border border-[#e8e8e8] p-4 bg-[#f5f5f5]';

          const content = (
            <>
              <Icon className={`w-5 h-5 mb-3 ${item.available ? 'text-[#d4af88]' : 'text-[#1a1a1a]'}`} />
              <h3 className={`text-lg font-semibold mb-1 ${item.available ? 'text-[#1a1a1a] group-hover:text-[#d4af88] transition' : 'text-[#1a1a1a]'}`}>
                {item.title}
              </h3>
              <p className="text-sm text-[#666666]">{item.description}</p>
              {!item.available && (
                <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-wide border border-[#d4af88] text-[#1a1a1a] px-2 py-1">
                  Coming Soon
                </span>
              )}
            </>
          );

          if (!item.available) {
            return (
              <div key={item.title} className={cardClassName}>
                {content}
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={item.to}
              className={cardClassName}
            >
              {content}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/change-password" className="group border border-[#e8e8e8] hover:border-[#d4af88] p-4 transition bg-white">
          <Lock className="w-5 h-5 mb-3 text-[#d4af88]" />
          <h3 className="text-lg font-semibold mb-1 text-[#1a1a1a] group-hover:text-[#d4af88] transition">Change Password</h3>
          <p className="text-sm text-[#666666]">Update your account password securely.</p>
        </Link>

        <button
          type="button"
          onClick={() => setShowConfirmDialog(true)}
          className="text-left border border-red-200 hover:bg-red-50 p-4 transition bg-white"
        >
          <Trash2 className="w-5 h-5 mb-3 text-red-600" />
          <h3 className="text-lg font-semibold mb-1 text-red-600">Delete Account</h3>
          <p className="text-sm text-[#666666]">Permanently delete your account and cancel active orders.</p>
        </button>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">Delete Account?</h3>
            </div>
            <p className="text-[#666666] mb-2">Are you sure you want to delete your account? This action cannot be undone.</p>
            <p className="text-[#666666] text-sm mb-6">All pending/processing orders will be automatically cancelled.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border border-[#e8e8e8] text-[#1a1a1a] font-medium rounded hover:bg-[#f5f5f5] transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
