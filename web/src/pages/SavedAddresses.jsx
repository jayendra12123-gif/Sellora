import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home, Briefcase, MapPin, Plus, Pencil, Trash2, Star, Loader } from 'lucide-react';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  selectAllAddresses,
  selectAddressesLoading,
  selectAddressesError
} from '../features/addresses/addressesSlice';

const emptyForm = {
  category: 'home',
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  isDefault: false
};

const categoryIcon = {
  home: Home,
  work: Briefcase,
  other: MapPin
};

export default function SavedAddresses() {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAllAddresses);
  const loading = useSelector(selectAddressesLoading);
  const error = useSelector(selectAddressesError);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, isDefault: addresses.length === 0 });
    setIsFormOpen(true);
  };

  const openEditForm = (address) => {
    setEditingId(address.id);
    setFormData({
      category: address.category,
      name: address.name,
      email: address.email || '',
      phone: address.phone || '',
      street: address.street,
      city: address.city,
      state: address.state || '',
      zip: address.zip,
      country: address.country || '',
      isDefault: !!address.isDefault
    });
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await dispatch(updateAddress({ id: editingId, ...formData })).unwrap();
      } else {
        await dispatch(createAddress(formData)).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save address:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this saved address?');
    if (!confirmed) return;

    try {
      await dispatch(deleteAddress(id)).unwrap();
      if (editingId === id) resetForm();
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#d4af88]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">Saved Addresses</h1>
          <p className="text-[#666666] mt-1">Manage your delivery addresses. All addresses are saved securely on the server.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#2d2d2d] transition"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 px-4 py-3 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-10 border border-[#e8e8e8] p-6 bg-white space-y-4">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">{editingId ? 'Edit Address' : 'New Address'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-[#1a1a1a]">
              Category
              <select name="category" value={formData.category} onChange={handleChange} className="mt-2 w-full border border-[#e8e8e8] px-3 py-2 bg-white" required>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="text-sm text-[#1a1a1a]">
              Name
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" required />
            </label>

            <label className="text-sm text-[#1a1a1a]">
              Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" />
            </label>

            <label className="text-sm text-[#1a1a1a]">
              Phone
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" />
            </label>

            <label className="text-sm text-[#1a1a1a] md:col-span-2">
              Street Address
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" required />
            </label>

            <label className="text-sm text-[#1a1a1a]">
              City
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" required />
            </label>

            <label className="text-sm text-[#1a1a1a]">
              State/Province
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State/Province" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" />
            </label>

            <label className="text-sm text-[#1a1a1a]">
              ZIP/Postal Code
              <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" required />
            </label>

            <label className="text-sm text-[#1a1a1a]">
              Country
              <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="mt-2 w-full border border-[#e8e8e8] px-3 py-2" />
            </label>

            <label className="text-sm text-[#1a1a1a] flex items-center gap-2">
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-4 h-4 accent-[#d4af88]" />
              Set as default address
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-[#1a1a1a] text-white font-semibold hover:bg-[#2d2d2d] disabled:opacity-50 transition">
              {submitting ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 border border-[#e8e8e8] text-[#1a1a1a] font-semibold hover:bg-[#f5f5f5] transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-[#f5f5f5] border border-[#e8e8e8]">
          <p className="text-[#666666] mb-4">No addresses added yet</p>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af88] text-white font-semibold hover:bg-[#c49f7a] transition"
          >
            <Plus className="w-4 h-4" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => {
            const IconComponent = categoryIcon[address.category] || MapPin;
            return (
              <div key={address.id} className="border border-[#e8e8e8] p-6 relative">
                {address.isDefault && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#f5f5f5] px-3 py-1 rounded text-xs font-semibold text-[#d4af88]">
                    <Star size={12} className="fill-[#d4af88]" />
                    Default
                  </div>
                )}

                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1 flex items-center gap-2">
                  <IconComponent size={18} className="text-[#d4af88]" />
                  {address.name}
                </h3>

                <p className="text-sm text-[#666666] mb-4">
                  {address.street}, {address.city}, {address.state} {address.zip}
                </p>

                {address.email && <p className="text-sm text-[#666666]">Email: {address.email}</p>}
                {address.phone && <p className="text-sm text-[#666666]">Phone: {address.phone}</p>}

                <div className="flex gap-2 mt-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 px-3 py-2 text-xs font-semibold border border-[#e8e8e8] text-[#1a1a1a] hover:bg-[#f5f5f5] transition flex items-center justify-center gap-1"
                    >
                      <Star size={14} />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => openEditForm(address)}
                    className="flex-1 px-3 py-2 text-xs font-semibold border border-[#e8e8e8] text-[#1a1a1a] hover:bg-[#f5f5f5] transition flex items-center justify-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 px-3 py-2 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
