import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllProducts } from '../features/products/productsSlice';
import { selectFavoriteIds } from '../features/favorites/favoritesSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';

const Favorites = () => {
  const products = useSelector(selectAllProducts);
  const favoriteIds = useSelector(selectFavoriteIds);

  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-xl w-full border border-[#e8e8e8] bg-[#f5f5f5] px-6 py-12 text-center">
          <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-3">No favorites yet</h2>
          <p className="text-[#666666] mb-8 max-w-md mx-auto">
            Save products you love to find them quickly later.
          </p>
          <Link to="/products" className="inline-flex justify-center">
            <Button variant="secondary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-serif font-bold text-[#1a1a1a] mb-3">Favorites</h1>
          <p className="text-[#666666]">Your saved products, all in one place.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact showAddToCart />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
