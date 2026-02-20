import { Heart, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { selectIsFavorite, toggleFavorite } from '../features/favorites/favoritesSlice';
import { Link, useNavigate } from 'react-router-dom';
import Card from './ui/Card';

const ProductCard = ({ product, compact = false, showAddToCart = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isFavorite = useSelector((state) => selectIsFavorite(state, product.id));
  const safePrice = Number(product.price || 0);
  const roundedRating = Math.max(0, Math.min(5, Math.round(product.rating || 0)));
  return (
    <Card bordered className="overflow-hidden group flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f5f5f5]">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.title} 
          className={`w-full h-full object-cover transition duration-300 ${compact ? 'group-hover:scale-110' : 'group-hover:scale-105'}`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        {isAuthenticated && (
          <button
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              dispatch(toggleFavorite(product.id));
            }}
            className="absolute top-2 left-2 w-10 h-10 p-0 rounded-full border border-red-200 bg-white/95 flex items-center justify-center text-red-500 hover:text-red-600 transition"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
        {product.isBestSeller && (
          <span className="absolute top-3 right-3 bg-[#d4af88] text-[#1a1a1a] text-xs font-semibold px-2 py-1">
            Best Seller
          </span>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        {!compact && (
          <div className="text-xs text-[#d4af88] font-semibold mb-2 uppercase tracking-widest">{product.category}</div>
        )}
        <Link to={`/products/${product.id}`} className="block mb-3">
          <h3 className="font-semibold text-[#1a1a1a] line-clamp-2 hover:text-[#d4af88] transition text-sm">{product.title}</h3>
        </Link>
        
        {!compact && (
          <div className="flex items-center mb-4 text-xs">
            <div className="flex text-[#d4af88]">
              {'★'.repeat(roundedRating)}
              <span className="text-[#e8e8e8]">{'★'.repeat(5 - roundedRating)}</span>
            </div>
            <span className="text-[#999999] ml-2">({product.rating || 0})</span>
          </div>
        )}
        
        <div className={`mt-auto flex items-center justify-between ${showAddToCart ? 'pt-4 border-t border-[#e8e8e8]' : ''}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[#d4af88]">${safePrice.toFixed(2)}</span>
            {product.originalPrice ? (
              <span className="text-xs text-[#999999] line-through">${Number(product.originalPrice).toFixed(2)}</span>
            ) : null}
            {product.discountPercent > 0 && (
              <span className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-2 py-1 rounded-full border border-emerald-200 bg-emerald-500 text-white text-[10px] font-semibold leading-none">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          {showAddToCart && (
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                dispatch(addToCart({ product, quantity: 1 }));
              }}
              className="flex items-center gap-1 bg-[#1a1a1a] text-white px-3 py-2 text-sm font-semibold hover:bg-[#2d2d2d] active:scale-95 transition uppercase tracking-wide"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
