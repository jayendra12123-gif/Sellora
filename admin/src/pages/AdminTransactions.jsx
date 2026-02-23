import { useEffect, useState } from 'react';
import { adminGet, adminPost } from '../api';
import Loader from '../components/Loader';

const formatCurrency = (value, currency = 'INR') => {
  const amount = Number(value || 0);
  if (Number.isNaN(amount)) return `${currency} 0.00`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refundPending, setRefundPending] = useState(null);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await adminGet('/admin/transactions');
      setTransactions(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefund = async (orderId, amount) => {
    setRefundPending(orderId);
    try {
      await adminPost('/admin/refund', { orderId, amount });
      await loadTransactions();
    } catch (err) {
      setError(err.message || 'Failed to refund');
    } finally {
      setRefundPending(null);
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>Transactions</div>
        {error && <div style={{ color: '#c0392b', marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <Loader />
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {transactions.map((order) => {
              const canRefund = order.paymentStatus === 'paid' && order.refundStatus !== 'processed';
              return (
                <div key={order.id} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Order {order.id}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>
                        {order.userName || order.userEmail || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b6b6b' }}>
                        {order.razorpayOrderId || 'Razorpay order pending'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      {formatCurrency(order.totalAmount || order.total, order.currency || 'INR')}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>
                      {order.paymentStatus || 'unknown'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : '--'}
                    </div>
                    <button
                      type="button"
                      className="button secondary"
                      disabled={!canRefund || refundPending === order.id}
                      onClick={() => handleRefund(order.id, order.totalAmount || order.total)}
                    >
                      {refundPending === order.id ? 'Refunding...' : 'Refund'}
                    </button>
                  </div>
                </div>
              );
            })}
            {!transactions.length && (
              <div style={{ textAlign: 'center', color: '#6b6b6b' }}>No transactions found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
