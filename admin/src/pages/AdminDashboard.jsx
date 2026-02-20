import { useEffect, useState } from 'react';
import { adminGet } from '../api';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const summaryData = await adminGet('/admin/summary');
        const ordersData = await adminGet('/admin/orders');
        setSummary(summaryData);
        setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 6) : []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      }
    };
    load();
  }, []);

  if (error) {
    return <div className="card" style={{ color: '#c0392b' }}>{error}</div>;
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="grid grid-2">
        {[
          { label: 'Total Products', value: summary?.products ?? '-' },
          { label: 'Total Orders', value: summary?.orders ?? '-' },
          { label: 'Total Users', value: summary?.users ?? '-' },
          { label: 'Collections', value: summary?.collections ?? '-' },
          { label: 'Pending Orders', value: summary?.pendingOrders ?? '-' },
          { label: 'Revenue', value: summary ? `$${Number(summary.revenue || 0).toFixed(2)}` : '-' },
        ].map((card) => (
          <div key={card.label} className="card">
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7a6a50' }}>
              {card.label}
            </div>
            <div style={{ marginTop: 12, fontSize: '1.8rem', fontWeight: 600 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Orders</div>
          <span className="badge">Latest 6 orders</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userName || order.userEmail || 'Unknown'}</td>
                  <td>${Number(order.total || 0).toFixed(2)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{order.status}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan="4" style={{ padding: 20, textAlign: 'center', color: '#6b6b6b' }}>
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
