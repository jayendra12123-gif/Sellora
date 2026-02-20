const STORAGE_KEY = 'sellora_saved_addresses';

const normalizeCategory = (category) => {
  const value = String(category || '').toLowerCase();
  if (value === 'home' || value === 'work' || value === 'other') return value;
  return 'other';
};

const sortAddresses = (items) => [...items].sort((a, b) => {
  if (a.isDefault && !b.isDefault) return -1;
  if (!a.isDefault && b.isDefault) return 1;
  return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
});

export const loadAddressBook = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? sortAddresses(parsed) : [];
  } catch (error) {
    console.error('Failed to load saved addresses:', error);
    return [];
  }
};

export const saveAddressBook = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortAddresses(items)));
};

export const upsertAddress = (currentItems, payload, id = null) => {
  const now = new Date().toISOString();
  const normalized = {
    id: id || `ADDR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    category: normalizeCategory(payload.category),
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    phone: String(payload.phone || '').trim(),
    street: String(payload.street || '').trim(),
    city: String(payload.city || '').trim(),
    state: String(payload.state || '').trim(),
    zip: String(payload.zip || '').trim(),
    country: String(payload.country || '').trim(),
    isDefault: !!payload.isDefault,
    createdAt: id ? (currentItems.find((item) => item.id === id)?.createdAt || now) : now,
    updatedAt: now
  };

  const withoutCurrent = currentItems.filter((item) => item.id !== normalized.id);
  const items = normalized.isDefault
    ? withoutCurrent.map((item) => ({ ...item, isDefault: false, updatedAt: now }))
    : withoutCurrent;

  const merged = [normalized, ...items];

  if (!merged.some((item) => item.isDefault) && merged.length > 0) {
    merged[0].isDefault = true;
  }

  return sortAddresses(merged);
};

export const removeAddress = (currentItems, id) => {
  const filtered = currentItems.filter((item) => item.id !== id);
  if (!filtered.some((item) => item.isDefault) && filtered.length > 0) {
    filtered[0] = { ...filtered[0], isDefault: true, updatedAt: new Date().toISOString() };
  }
  return sortAddresses(filtered);
};

export const markDefaultAddress = (currentItems, id) => {
  const now = new Date().toISOString();
  return sortAddresses(currentItems.map((item) => ({
    ...item,
    isDefault: item.id === id,
    updatedAt: now
  })));
};
