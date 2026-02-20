import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Lock, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { AUTH_API_URL } from '../config/api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password validation
  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const passwordsMatch = formData.newPassword === formData.confirmPassword;
  const isNewPasswordValid = isPasswordValid(formData.newPassword);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!isNewPasswordValid) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to change password');
        return;
      }

      setSuccess('Password changed successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/profile" className="inline-flex items-center gap-2 text-[#d4af88] hover:text-[#1a1a1a] font-semibold mb-12 uppercase text-sm tracking-wide">
          <ArrowLeft size={20} />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#f5f5f5] rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#d4af88]" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">Change Password</h1>
              <p className="text-[#666666] mt-1">Update your account password</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card bordered>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded p-4 flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Current Password
                <span className="text-[#d4af88] ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="w-full px-5 py-3 border-b-2 border-[#e8e8e8] bg-white text-[#1a1a1a] placeholder-[#999999] focus:border-[#d4af88] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-3 text-[#d4af88] hover:text-[#1a1a1a] transition"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wide">
                New Password
                <span className="text-[#d4af88] ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full px-5 py-3 border-b-2 border-[#e8e8e8] bg-white text-[#1a1a1a] placeholder-[#999999] focus:border-[#d4af88] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-3 text-[#d4af88] hover:text-[#1a1a1a] transition"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {isNewPasswordValid ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
                <span className={`text-xs font-medium ${isNewPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
                  Minimum 8 characters
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Confirm Password
                <span className="text-[#d4af88] ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="w-full px-5 py-3 border-b-2 border-[#e8e8e8] bg-white text-[#1a1a1a] placeholder-[#999999] focus:border-[#d4af88] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-3 text-[#d4af88] hover:text-[#1a1a1a] transition"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {passwordsMatch ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-[#f5f5f5] border border-[#e8e8e8] p-4 rounded">
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-3">Password Requirements</p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#d4af88] rounded-full"></span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#d4af88] rounded-full"></span>
                  Different from current password
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#d4af88] rounded-full"></span>
                  Passwords must match
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[#e8e8e8]">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={loading || !formData.currentPassword || !isNewPasswordValid || !passwordsMatch}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
              <Link to="/profile" className="flex-1">
                <Button variant="secondary" type="button" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Security Info */}
        <Card dark className="mt-8">
          <h3 className="text-lg font-serif font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#d4af88]" />
            Security Tips
          </h3>
          <ul className="space-y-2 text-[#666666] text-sm">
            <li>• Use a strong, unique password</li>
            <li>• Avoid using personal information</li>
            <li>• Don't share your password with anyone</li>
            <li>• Change your password regularly</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
