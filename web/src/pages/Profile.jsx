import { useSelector } from 'react-redux';
import { User, Mail, Calendar, ArrowLeft, BadgeCheck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Profile() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-[#d4af88] hover:text-[#1a1a1a] font-semibold mb-12 uppercase text-sm tracking-wide">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-[#d4af88] to-[#8b7355] rounded-lg flex items-center justify-center border-2 border-[#e8e8e8] shadow-md">
              <User className="w-16 h-16 text-white" />
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-5xl font-serif font-bold text-[#1a1a1a] mb-2">{user?.name || 'User'}</h1>
              <p className="text-[#666666] flex items-center gap-2">
                <Mail size={16} />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-[#f5f5f5] border border-[#e8e8e8] w-fit px-4 py-2 rounded">
            <BadgeCheck className="w-5 h-5 text-[#d4af88]" />
            <span className="text-[#1a1a1a] font-semibold text-sm">Account Verified</span>
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Contact Information */}
          <Card bordered>
            <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#d4af88]" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="bg-[#f5f5f5] p-4 border border-[#e8e8e8]">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2">Email</p>
                <p className="text-[#1a1a1a] font-semibold">{user?.email}</p>
              </div>
            </div>
          </Card>

          {/* Account Details */}
          <Card bordered>
            <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#d4af88]" />
              Account Details
            </h3>
            <div className="space-y-4">
              <div className="bg-[#f5f5f5] p-4 border border-[#e8e8e8]">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2">Member Since</p>
                <p className="text-[#1a1a1a] font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Recently'}
                </p>
              </div>
              <div className="bg-[#f5f5f5] p-4 border border-[#e8e8e8]">
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2">Account Status</p>
                <p className="text-[#d4af88] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#d4af88] rounded-full"></span>
                  Active
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Account Preferences */}
        <Card bordered className="mb-12">
          <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-6">Account Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#f5f5f5] border border-[#e8e8e8]">
              <div>
                <p className="font-semibold text-[#1a1a1a] mb-1">Email Notifications</p>
                <p className="text-sm text-[#666666]">Receive updates about your orders and new arrivals</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#d4af88]" />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f5f5f5] border border-[#e8e8e8]">
              <div>
                <p className="font-semibold text-[#1a1a1a] mb-1">Marketing Emails</p>
                <p className="text-sm text-[#666666]">Get exclusive offers and early access to new collections</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#d4af88]" />
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="primary">Edit Profile</Button>
          <Link to="/orders" className="block">
            <Button variant="secondary" className="w-full">
              <span className="inline-flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                View My Orders
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
