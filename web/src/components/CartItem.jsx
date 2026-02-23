import { Trash2, Minus, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import Card from './ui/Card';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const productTitle = item.title || item.name || 'Product';

  return (
    <Card bordered>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-[#f5f5f5] overflow-hidden border border-[#e8e8e8]">
          <img src={item.image || 'https://via.placeholder.com/96'} alt={productTitle} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-grow">
          <h3 className="font-semibold text-[#1a1a1a] mb-1">{productTitle}</h3>
          <p className="text-xs text-[#666666] mb-3 uppercase tracking-wide">{item.category}</p>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {item.isBestSeller && (
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#f5f5f5] border border-[#d4af88] text-[#1a1a1a] px-2 py-1">
                Best Seller
              </span>
            )}
            {item.discountPercent > 0 && (
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#1a1a1a] text-[#f5d6b4] px-2 py-1">
                -{item.discountPercent}%
              </span>
            )}
          </div>
          <p className="font-bold text-[#d4af88]">₹{item.price.toFixed(2)}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          {/* Quantity */}
          <div className="flex items-center border border-[#e8e8e8]">
            <button
              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
              disabled={item.quantity <= 1}
              className="p-1 text-[#666666] hover:text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-[#1a1a1a] text-sm">{item.quantity}</span>
            <button
              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
              className="p-1 text-[#666666] hover:text-[#1a1a1a] transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-xs text-[#666666] mb-1">Subtotal</p>
            <p className="font-semibold text-[#1a1a1a] text-lg">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="p-2 text-red-500 hover:bg-red-50 transition"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
