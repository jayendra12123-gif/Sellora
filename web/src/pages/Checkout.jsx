import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, Mail, MapPin, Phone } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotalPrice, clearCart } from '../features/cart/cartSlice';
import { API_URL } from '../config/api';
import { selectAllAddresses } from '../features/addresses/addressesSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const mapAddressToForm = (address) => ({
  firstName: address?.name?.split(' ').slice(0, -1).join(' ') || address?.name || '',
  lastName: address?.name?.split(' ').slice(-1).join(' ') || '',
  email: address?.email || '',
  phone: address?.phone || '',
  address: address?.street || '',
  city: address?.city || '',
  state: address?.state || '',
  zipCode: address?.zip || '',
  country: address?.country || ''
});

const Checkout = () => {
  const cart = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addressMode, setAddressMode] = useState('custom');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const savedAddresses = useSelector(selectAllAddresses);

  const sortedAddresses = useMemo(
    () => [...savedAddresses].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1)),
    [savedAddresses]
  );

  const selectedSavedAddress = useMemo(
    () => sortedAddresses.find((address) => address.id === selectedAddressId) || null,
    [sortedAddresses, selectedAddressId]
  );

  useEffect(() => {
    if (sortedAddresses.length === 0) {
      setAddressMode('custom');
      setSelectedAddressId('');
      return;
    }

    const defaultAddress = sortedAddresses.find((address) => address.isDefault) || sortedAddresses[0];
    if (!selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
    if (addressMode !== 'saved') {
      setAddressMode('saved');
    }
  }, [sortedAddresses, selectedAddressId, addressMode]);

  useEffect(() => {
    if (!authUser?.name && !authUser?.email) return;
    setFormData((prev) => {
      if (prev.firstName || prev.lastName || prev.email) return prev;
      const nameParts = (authUser.name || '').trim().split(' ').filter(Boolean);
      const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(-1).join(' ') : '';
      return {
        ...prev,
        firstName,
        lastName,
        email: authUser.email || prev.email
      };
    });
  }, [authUser]);

  if (cart.length === 0 && !isSuccess) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'First name can only contain letters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Last name can only contain letters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\+?[\d\s()-]{10,}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number';
        return '';
      case 'address':
        if (!value.trim()) return 'Street address is required';
        if (value.trim().length < 5) return 'Please enter a complete address';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'City can only contain letters';
        return '';
      case 'state':
        if (!value.trim()) return 'State is required';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'State can only contain letters';
        return '';
      case 'zipCode':
        if (!value.trim()) return 'Zip code is required';
        if (!/^\d{5}(-\d{4})?$/.test(value)) return 'Please enter a valid zip code (e.g., 12345)';
        return '';
      case 'country':
        if (!value.trim()) return 'Country is required';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Country can only contain letters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    if (addressMode === 'saved') {
      if (!selectedSavedAddress) {
        setErrors({ selectedAddress: 'Please select a saved address' });
        return false;
      }
      setErrors({});
      return true;
    }

    const newErrors = {};
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      country: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = document.querySelector('.border-b-red-500');
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    const taxAmount = totalPrice * 0.08;
    const finalTotal = totalPrice + taxAmount;

    const shippingAddress = addressMode === 'saved' && selectedSavedAddress
      ? {
          name: selectedSavedAddress.name,
          email: selectedSavedAddress.email,
          phone: selectedSavedAddress.phone,
          street: selectedSavedAddress.street,
          city: selectedSavedAddress.city,
          state: selectedSavedAddress.state,
          zip: selectedSavedAddress.zip,
          country: selectedSavedAddress.country
        }
      : {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
          country: formData.country
        };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const createResponse = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          shippingAddress
        })
      });

      const createData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(createData.message || 'Failed to initialize payment');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout');
      }

      const options = {
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: 'Sellora',
        description: 'Order payment',
        order_id: createData.razorpayOrderId,
        prefill: {
          name: shippingAddress?.name || authUser?.name || '',
          email: shippingAddress?.email || authUser?.email || '',
          contact: shippingAddress?.phone || ''
        },
        notes: {
          orderId: createData.orderId
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${API_URL}/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            dispatch(clearCart());
            setIsSuccess(true);
          } catch (verifyError) {
            setErrors((prev) => ({
              ...prev,
              submit: verifyError.message || 'Payment verification failed. Please contact support.'
            }));
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await fetch(`${API_URL}/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: createData.razorpayOrderId,
                status: 'failed'
              })
            }).catch(() => {});
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async () => {
        await fetch(`${API_URL}/payments/verify-payment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            razorpay_order_id: createData.razorpayOrderId,
            status: 'failed'
          })
        }).catch(() => {});
        setErrors((prev) => ({
          ...prev,
          submit: 'Payment failed. Please try again.'
        }));
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error?.message || 'Failed to start payment. Please try again.'
      }));
      setIsProcessing(false);
    }
  };

  const taxAmount = totalPrice * 0.08;
  const finalTotal = totalPrice + taxAmount;

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="w-24 h-24 bg-[#f5f5f5] border border-[#d4af88] text-[#d4af88] rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-4">Order Placed!</h1>
        <p className="text-[#666666] mb-8 max-w-md leading-relaxed">Thank you for your purchase. We've sent a confirmation email with your order details and tracking information.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-serif font-bold text-[#1a1a1a] mb-2">Checkout</h1>
        <p className="text-[#666666]">Complete your order securely</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-8">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{errors.submit}</div>}

              <div className="border border-[#e8e8e8] bg-[#f5f5f5] p-4">
                <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Delivery Address Option</p>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-[#1a1a1a]">
                    <input type="radio" checked={addressMode === 'saved'} onChange={() => { setAddressMode('saved'); setErrors((prev) => ({ ...prev, selectedAddress: '' })); }} disabled={sortedAddresses.length === 0} className="accent-[#d4af88]" />
                    Use saved address
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#1a1a1a]">
                    <input type="radio" checked={addressMode === 'custom'} onChange={() => { setAddressMode('custom'); setErrors((prev) => ({ ...prev, selectedAddress: '' })); }} className="accent-[#d4af88]" />
                    Add different address
                  </label>
                </div>
                {sortedAddresses.length === 0 && <p className="text-xs text-[#666666] mt-3">No saved addresses found yet. Continue with a different address.</p>}
              </div>

              {addressMode === 'saved' && (
                <div className="space-y-3">
                  {sortedAddresses.map((address) => (
                    <label key={address.id} className={`block border p-4 cursor-pointer transition ${selectedAddressId === address.id ? 'border-[#d4af88] bg-[#f5f5f5]' : 'border-[#e8e8e8] bg-white'}`}>
                      <div className="flex items-start gap-3">
                        <input type="radio" name="selectedSavedAddress" checked={selectedAddressId === address.id} onChange={() => { setSelectedAddressId(address.id); setErrors((prev) => ({ ...prev, selectedAddress: '' })); }} className="mt-1 accent-[#d4af88]" />
                        <div className="text-sm">
                          <p className="font-semibold text-[#1a1a1a]">{address.name} {address.isDefault ? '(Default)' : ''}</p>
                          <p className="text-[#666666]">{address.email} • {address.phone}</p>
                          <p className="text-[#444444]">{address.street}, {address.city}, {address.state} {address.zip}, {address.country}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                  {errors.selectedAddress && <p className="text-sm text-red-600">{errors.selectedAddress}</p>}
                </div>
              )}

              {addressMode === 'custom' && (
                <>
                  {selectedSavedAddress && (
                    <button type="button" onClick={() => setFormData(mapAddressToForm(selectedSavedAddress))} className="text-xs uppercase tracking-wide font-semibold border border-[#d4af88] px-3 py-2 text-[#1a1a1a] hover:bg-[#f5f5f5]">
                      Prefill from selected saved address
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" icon={User} type="text" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="Jane" error={touched.firstName ? errors.firstName : ''} required />
                    <Input label="Last Name" icon={User} type="text" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Doe" error={touched.lastName ? errors.lastName : ''} required />
                  </div>

                  <Input label="Email Address" icon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="jane@example.com" error={touched.email ? errors.email : ''} required />
                  <Input label="Phone Number" icon={Phone} type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="+1 (555) 123-4567" error={touched.phone ? errors.phone : ''} required />
                  <Input label="Street Address" icon={MapPin} type="text" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur} placeholder="123 Main Street" error={touched.address ? errors.address : ''} required />

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" type="text" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} placeholder="New York" error={touched.city ? errors.city : ''} required />
                    <Input label="State" type="text" name="state" value={formData.state} onChange={handleChange} onBlur={handleBlur} placeholder="NY" error={touched.state ? errors.state : ''} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Zip Code" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleBlur} placeholder="10001" error={touched.zipCode ? errors.zipCode : ''} required />
                    <Input label="Country" type="text" name="country" value={formData.country} onChange={handleChange} onBlur={handleBlur} placeholder="United States" error={touched.country ? errors.country : ''} required />
                  </div>
                </>
              )}

              <div className="pt-8 border-t border-[#e8e8e8]">
                <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-8">Payment</h2>
                <div className="bg-[#f5f5f5] border border-[#e8e8e8] p-4 rounded mb-6">
                  <p className="text-sm text-[#666666] text-center">This is a secure mock checkout. No real payment information is processed.</p>
                </div>
                <Button type="submit" variant="primary" isLoading={isProcessing} disabled={isProcessing} className="w-full py-4">
                  {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card bordered className="sticky top-24">
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6 pb-6 border-b border-[#e8e8e8]">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#f5f5f5] border border-[#e8e8e8] flex-shrink-0 overflow-hidden">
                      <img src={item.image || 'https://via.placeholder.com/64'} alt={item.title || item.name || 'Product'} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1a1a1a] line-clamp-2">{item.title || item.name || 'Product'}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {item.isBestSeller && <span className="text-[10px] uppercase tracking-wide font-semibold text-[#1a1a1a] bg-[#f5f5f5] border border-[#d4af88] px-1.5 py-0.5">Best Seller</span>}
                        {item.discountPercent > 0 && <span className="text-[10px] uppercase tracking-wide font-semibold text-[#f5d6b4] bg-[#1a1a1a] px-1.5 py-0.5">-{item.discountPercent}%</span>}
                      </div>
                      <p className="text-xs text-[#666666]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-[#d4af88] whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[#666666] text-sm"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-[#666666] text-sm"><span>Tax (8%)</span><span>₹{taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between pt-3 border-t border-[#e8e8e8]"><span className="font-semibold text-[#1a1a1a]">Total</span><span className="text-2xl font-bold text-[#d4af88]">₹{finalTotal.toFixed(2)}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
