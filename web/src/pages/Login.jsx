import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 lg:px-20 py-12 md:py-0">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#666666] text-lg">
              Access your account to continue shopping
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 px-6 py-4 rounded-none">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition"
                />
                <Mail className="absolute right-0 top-3.5 text-[#d4af88] w-5 h-5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-[#d4af88] hover:text-[#1a1a1a] transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-[#d4af88] rounded-none accent-[#d4af88]"
                />
                <span className="text-sm text-[#666666]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-[#d4af88] hover:text-[#1a1a1a] transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a1a1a] text-white py-4 mt-10 font-semibold text-sm uppercase tracking-wide hover:bg-[#2d2d2d] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-8 border-t border-[#e8e8e8]">
            <p className="text-[#666666] text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#1a1a1a] hover:text-[#d4af88] transition">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Image/Decor */}
      <div className="hidden md:flex w-1/2 bg-[#f5f5f5] items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 border border-[#1a1a1a]"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 border border-[#d4af88]"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-[#1a1a1a]"></div>
        </div>
        <div className="text-center z-10">
          <div className="mb-6">
            <Lock className="w-20 h-20 text-[#d4af88] mx-auto" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4">Secure Access</h2>
          <p className="text-[#666666] max-w-xs">
            Your account is protected with top-notch security measures
          </p>
        </div>
      </div>
    </div>
  );
}
