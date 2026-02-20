import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders, selectAllOrders, selectOrdersStatus, selectOrdersError, selectOrdersLoading } from '../features/orders/ordersSlice';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
  }, [status]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-[#d4af88] hover:text-[#1a1a1a] font-semibold mb-8 uppercase text-sm tracking-wide">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-3">My Orders</h1>
          <p className="text-[#666666] text-lg">View and track your order history</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 px-6 py-4 rounded mb-6">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#f5f5f5] border border-[#e8e8e8]">
            <Package className="w-16 h-16 text-[#d4af88] mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-2">No orders yet</h3>
            <p className="text-[#666666] mb-6">You haven't placed any orders yet.</p>
            <Link 
              to="/products" 
              className="inline-block bg-[#1a1a1a] text-white px-8 py-3 font-semibold text-sm uppercase tracking-wide hover:bg-[#2d2d2d] transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-[#e8e8e8] hover:border-[#d4af88] transition duration-300">
                {/* Order Header */}
                <div className="bg-[#f5f5f5] px-6 py-4 border-b border-[#e8e8e8] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide">Order ID</p>
                    <p className="text-[#1a1a1a] font-bold font-mono">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide">Order Date</p>
                    <p className="text-[#1a1a1a] font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items && order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#f5f5f5] border border-[#e8e8e8] flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-[#999999]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1a1a1a] line-clamp-1">{item.title}</p>
                          <p className="text-sm text-[#666666]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-[#1a1a1a]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <p className="text-sm text-[#666666] text-center py-2">
                        + {order.items.length - 3} more item(s)
                      </p>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#e8e8e8] gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide">Total Amount</p>
                      <p className="text-2xl font-serif font-bold text-[#1a1a1a]">${order.total?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link 
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-[#d4af88] hover:text-[#1a1a1a] font-semibold text-sm transition"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

