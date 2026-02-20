import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../features/auth/authSlice';
import { Mail, Lock, User, Check, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [validations, setValidations] = useState({
    passwordLength: false,
    passwordMatch: false,
    emailValid: false
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Validate password length
    setValidations(prev => ({
      ...prev,
      passwordLength: formData.password.length >= 6
    }));

    // Validate password match
    setValidations(prev => ({
      ...prev,
      passwordMatch: formData.password === formData.confirmPassword && formData.password.length > 0
    }));

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidations(prev => ({
      ...prev,
      emailValid: emailRegex.test(formData.email)
    }));
  }, [formData.email, formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validations.passwordLength && validations.passwordMatch && validations.emailValid && formData.name && formData.agree) {
      dispatch(signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }));
    }
  };

  const isFormValid = validations.passwordLength && validations.passwordMatch && validations.emailValid && formData.name.trim() !== '' && formData.agree;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 lg:px-20 py-12 md:py-0">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mb-2">
              Create Account
            </h1>
            <p className="text-[#666666] text-lg">
              Join us and start your journey
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

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                  className="w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition"
                />
                <User className="absolute right-0 top-3.5 text-[#d4af88] w-5 h-5" />
              </div>
            </div>

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
                  placeholder="you@example.com"
                  required
                  className="w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition"
                />
                <Mail className="absolute right-0 top-3.5 text-[#d4af88] w-5 h-5" />
              </div>
              {formData.email && !validations.emailValid && (
                <p className="text-xs text-red-600 mt-2">Invalid email address</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition"
                />
                <Lock className="absolute right-0 top-3.5 text-[#d4af88] w-5 h-5" />
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <Check size={16} className={validations.passwordLength ? 'text-[#d4af88]' : 'text-[#e8e8e8]'} />
                  <span className={`text-xs ${validations.passwordLength ? 'text-[#d4af88]' : 'text-[#999999]'}`}>
                    At least 6 characters
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1a1a1a] mb-3 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition"
                />
                <Lock className="absolute right-0 top-3.5 text-[#d4af88] w-5 h-5" />
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  <Check size={16} className={validations.passwordMatch ? 'text-[#d4af88]' : 'text-red-500'} />
                  <span className={`text-xs ${validations.passwordMatch ? 'text-[#d4af88]' : 'text-red-600'}`}>
                    {validations.passwordMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="w-4 h-4 mt-1 bg-white border border-[#d4af88] rounded-none accent-[#d4af88] cursor-pointer"
                required
              />
              <span className="text-xs text-[#666666] leading-relaxed">
                I agree to the <a href="#" className="text-[#d4af88] font-semibold hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#d4af88] font-semibold hover:underline">Privacy Policy</a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-[#1a1a1a] text-white py-4 mt-10 font-semibold text-sm uppercase tracking-wide hover:bg-[#2d2d2d] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8 pt-8 border-t border-[#e8e8e8]">
            <p className="text-[#666666] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#1a1a1a] hover:text-[#d4af88] transition">
                Sign in
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
            <User className="w-20 h-20 text-[#d4af88] mx-auto" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4">Join Our Community</h2>
          <p className="text-[#666666] max-w-xs">
            Create an account to save your favorites and access exclusive member benefits
          </p>
        </div>
      </div>
    </div>
  );
}
