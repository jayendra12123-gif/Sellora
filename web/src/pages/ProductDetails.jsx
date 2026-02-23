import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Truck, Shield, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductById, selectProductsStatus } from '../features/products/productsSlice';
import { addToCart, selectCartItems } from '../features/cart/cartSlice';
import { selectIsFavorite, toggleFavorite } from '../features/favorites/favoritesSlice';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const productId = parseInt(id);

  const product = useSelector((state) => selectProductById(state, productId));
  const status = useSelector(selectProductsStatus);
  const cartItems = useSelector(selectCartItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isFavorite = useSelector((state) => selectIsFavorite(state, productId));
  
  // Check if this product is already in the cart
  const isInCart = cartItems.some(item => item.id === productId);

  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => setAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [added]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4">Product not found</h2>
        <Link to="/products">
          <Button variant="secondary">Back to Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ product, quantity }));
    setAdded(true);
    setQuantity(1);
  };

  const discountPercent = Number(product.discountPercent || 0);
  const originalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : discountPercent > 0
      ? Number((product.price / (1 - discountPercent / 100)).toFixed(2))
      : null;
  const savingsAmount = originalPrice ? Number((originalPrice - product.price).toFixed(2)) : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">Back</span>
        </button>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-[#f5f5f5] aspect-square overflow-hidden border border-[#e8e8e8]">
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs font-semibold text-[#d4af88] uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.isBestSeller && (
                  <span className="text-xs font-semibold uppercase tracking-wide bg-[#f5f5f5] border border-[#d4af88] text-[#1a1a1a] px-3 py-1">
                    Best Seller
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold uppercase tracking-wide bg-[#1a1a1a] text-[#f5d6b4] px-3 py-1">
                    Sale {discountPercent}% Off
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mb-4">
                {product.title}
              </h1>
              <p className="text-lg text-[#666666] leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-[#e8e8e8] py-6">
              <p className="text-[#666666] text-sm mb-2">Price</p>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-bold text-[#1a1a1a]">
                  ${product.price.toFixed(2)}
                </p>
                {originalPrice && (
                  <p className="text-xl text-[#999999] line-through mb-1">
                    ${originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              {discountPercent > 0 && (
                <p className="text-sm text-[#d4af88] font-semibold mt-2">
                  You save ${savingsAmount.toFixed(2)} ({discountPercent}% off)
                </p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#666666] uppercase tracking-widest mb-3">
                  Quantity
                </p>
                <div className="flex items-center border border-[#e8e8e8] w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-[#f5f5f5] transition-colors"
                  >
                    −
                  </button>
                  <div className="flex-1 w-12 text-center font-semibold text-[#1a1a1a]">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-[#f5f5f5] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-3">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => dispatch(toggleFavorite(product.id))}
                    className="w-full flex items-center justify-center gap-2 border border-[#e8e8e8] text-[#1a1a1a] py-3 hover:bg-[#f5f5f5] transition"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#d4af88] text-[#d4af88]' : 'text-[#d4af88]'}`} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                )}
                {isInCart ? (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/cart')}
                    className="w-full py-4"
                  >
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    className="w-full py-4"
                  >
                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                  </Button>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-6 border-t border-[#e8e8e8]">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#d4af88] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#1a1a1a] text-sm">Free Shipping</p>
                  <p className="text-[#666666] text-xs">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#d4af88] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#1a1a1a] text-sm">Secure Purchase</p>
                  <p className="text-[#666666] text-xs">Your payment is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <Section title="Related Products" centered>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for related products - would be populated from store */}
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} bordered>
              <div className="bg-[#f5f5f5] aspect-square mb-4 border border-[#e8e8e8]"></div>
              <p className="text-[#999999] text-sm">Similar items</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ProductDetails;
