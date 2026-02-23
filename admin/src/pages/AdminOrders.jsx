import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '../api';
import Loader from '../components/Loader';

const statusOptions = ['processing', 'pending', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminGet('/admin/orders');
      setOrders(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await adminPut(`/admin/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>Orders</div>
        {error && <div style={{ color: '#c0392b', marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <Loader />
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {orders.map((order) => (
              <div key={order.id} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Order {order.id}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>
                      {order.userName || order.userEmail || 'Unknown'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>Total: ₹{Number(order.total || 0).toFixed(2)}</div>
                  <select
                    className="select"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginTop: 10, fontSize: '0.85rem', color: '#6b6b6b' }}>
                  {order.items?.length || 0} items
                </div>
                <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                  {(order.items || []).map((item, index) => (
                    <div key={`${order.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>{item.title || item.id}</div>
                      <div style={{ color: '#6b6b6b' }}>Qty {item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!orders.length && (
              <div style={{ textAlign: 'center', color: '#6b6b6b' }}>No orders found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
