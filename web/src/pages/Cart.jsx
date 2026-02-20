import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotalItems, selectCartTotalPrice } from '../features/cart/cartSlice';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Cart = () => {
  const cart = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const navigate = useNavigate();
  const taxRate = 0.08;
  const taxAmount = totalPrice * taxRate;
  const finalTotal = totalPrice + taxAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-[#f5f5f5] border border-[#e8e8e8] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-[#d4af88]" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4">Your cart is empty</h2>
        <p className="text-[#666666] mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Let's change that!</p>
        <Link to="/products">
          <Button variant="primary">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-serif font-bold text-[#1a1a1a] mb-2">
          Shopping Cart
        </h1>
        <p className="text-[#666666]">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Continue Shopping */}
            <Link to="/products" className="inline-flex items-center gap-2 text-[#d4af88] font-semibold hover:text-[#1a1a1a] transition-colors mt-8">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card bordered className="sticky top-24">
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {/* Subtotal */}
                <div className="flex justify-between text-[#666666] text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-[#666666] text-sm">
                  <span>Shipping</span>
                  <span className="text-[#d4af88] font-semibold">Free</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-[#666666] text-sm">
                  <span>Tax (Est.)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="border-t border-[#e8e8e8] pt-4 flex justify-between text-[#1a1a1a]">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="primary"
                onClick={() => navigate('/checkout')}
                className="w-full py-4"
              >
                Proceed to Checkout
              </Button>
            </Card>

            {/* Info Box */}
            <div className="bg-[#f5f5f5] border border-[#e8e8e8] p-4 mt-6 text-center text-sm text-[#666666]">
              <p>✓ Secure checkout</p>
              <p>✓ Free returns on all orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
