import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOrderById, selectCurrentOrder, selectCurrentOrderStatus, selectCurrentOrderError, clearCurrentOrder, cancelOrder } from '../features/orders/ordersSlice';
import { ArrowLeft, Package, Clock, CheckCircle, MapPin, CreditCard, Truck, ChevronRight, XCircle, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cancelling, setCancelling] = useState(false);
  const [cancellationError, setCancellationError] = useState(null);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);

  const order = useSelector(selectCurrentOrder);
  const status = useSelector(selectCurrentOrderStatus);
  const error = useSelector(selectCurrentOrderError);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [id, dispatch]);

  const canCancelOrder = () => {
    return order && order.status !== 'delivered' && order.status !== 'cancelled';
  };

  const handleCancelOrder = async () => {
    if (!order || !canCancelOrder()) return;

    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );

    if (!confirmCancel) return;

    setCancelling(true);
    setCancellationError(null);
    setCancellationSuccess(false);

    try {
      const result = await dispatch(cancelOrder(order.id));
      if (result.payload) {
        setCancellationSuccess(true);
        // Refresh order details
        setTimeout(() => {
          dispatch(fetchOrderById(id));
        }, 1500);
      } else if (result.error) {
        setCancellationError(result.payload || 'Failed to cancel order');
      }
    } catch (err) {
      setCancellationError(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
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

  if (status === 'loading' || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-2">Error Loading Order</h2>
          <p className="text-[#666666] mb-6">{error}</p>
          <Link 
            to="/orders" 
            className="inline-block bg-[#1a1a1a] text-white px-8 py-3 font-semibold text-sm uppercase tracking-wide hover:bg-[#2d2d2d] transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/orders" className="inline-flex items-center gap-2 text-[#d4af88] hover:text-[#1a1a1a] font-semibold mb-8 uppercase text-sm tracking-wide">
          <ArrowLeft size={20} />
          Back to Orders
        </Link>

        {/* Cancellation Messages */}
        {cancellationSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Order Cancelled Successfully</p>
              <p className="text-sm text-green-700">Your order has been cancelled. You will receive a refund within 5-7 business days.</p>
            </div>
          </div>
        )}

        {cancellationError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error Cancelling Order</p>
              <p className="text-sm text-red-700">{cancellationError}</p>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">Order Details</h1>
              <p className="text-[#666666]">Order ID: <span className="font-mono font-semibold text-[#1a1a1a]">{order.id}</span></p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <span className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
          <p className="text-[#666666]">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white border border-[#e8e8e8]">
              <div className="bg-[#f5f5f5] px-6 py-4 border-b border-[#e8e8e8]">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Items Ordered</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b border-[#e8e8e8] last:border-b-0 last:pb-0">
                      <div className="w-20 h-20 bg-[#f5f5f5] border border-[#e8e8e8] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title || 'Product'} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-[#999999]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/products/${item.id}`}
                          className="font-semibold text-[#1a1a1a] hover:text-[#d4af88] transition line-clamp-2 block"
                        >
                          {item.title || 'Product'}
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          {item.isBestSeller && (
                            <span className="text-[10px] uppercase tracking-wide font-semibold text-[#1a1a1a] bg-[#f5f5f5] border border-[#d4af88] px-1.5 py-0.5">
                              Best Seller
                            </span>
                          )}
                          {item.discountPercent > 0 && (
                            <span className="text-[10px] uppercase tracking-wide font-semibold text-[#f5d6b4] bg-[#1a1a1a] px-1.5 py-0.5">
                              -{item.discountPercent}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#666666] mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-[#1a1a1a]">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-[#666666]">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white border border-[#e8e8e8]">
              <div className="bg-[#f5f5f5] px-6 py-4 border-b border-[#e8e8e8]">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Order Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-semibold text-[#1a1a1a]">Order Placed</p>
                      <p className="text-sm text-[#666666]">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Processing</p>
                        <p className="text-sm text-[#666666]">Your order is being prepared</p>
                      </div>
                    </div>
                  )}
                  
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Shipped</p>
                        <p className="text-sm text-[#666666]">Your order has been shipped</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'delivered' && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Delivered</p>
                        <p className="text-sm text-[#666666]">Your order has been delivered</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Order Cancelled</p>
                        <p className="text-sm text-[#666666]">This order has been cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-[#e8e8e8]">
              <div className="bg-[#f5f5f5] px-6 py-4 border-b border-[#e8e8e8]">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Subtotal</span>
                    <span className="text-[#1a1a1a] font-medium">${order.total ? (order.total * 0.9).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Shipping</span>
                    <span className="text-[#1a1a1a] font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Tax</span>
                    <span className="text-[#1a1a1a] font-medium">${order.total ? (order.total * 0.1).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="border-t border-[#e8e8e8] pt-3 flex justify-between">
                    <span className="font-semibold text-[#1a1a1a]">Total</span>
                    <span className="text-xl font-serif font-bold text-[#1a1a1a]">${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[#e8e8e8]">
              <div className="bg-[#f5f5f5] px-6 py-4 border-b border-[#e8e8e8]">
                <h2 className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>
              </div>
              <div className="p-6">
                {order.shippingAddress ? (
                  <div className="text-[#666666]">
                    {order.shippingAddress.name && <p className="font-semibold text-[#1a1a1a]">{order.shippingAddress.name}</p>}
                    {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                    {(order.shippingAddress.city || order.shippingAddress.state || order.shippingAddress.zip) && (
                      <p>
                        {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                  </div>
                ) : (
                  <p className="text-[#666666]">No shipping address provided</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#e8e8e8]">
              <div className="bg-[#f5f5f5] px-6 py-4 border-b border-[#e8e8e8]">
                <h2 className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <p className="text-[#666666] capitalize">{order.paymentMethod || 'Card'}</p>
                <p className="text-sm text-[#999999] mt-1">Payment completed</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canCancelOrder() && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-4 font-semibold text-sm uppercase tracking-wide transition flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </>
                  )}
                </button>
              )}
              <Link 
                to="/products"
                className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] text-white px-6 py-4 font-semibold text-sm uppercase tracking-wide hover:bg-[#2d2d2d] transition"
              >
                Continue Shopping
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
