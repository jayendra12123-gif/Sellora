import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../features/products/productsSlice';
import Button from '../components/ui/Button';
import Section from '../components/ui/Section';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config/api';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      try {
        const response = await fetch(`${API_URL}/collections`);
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setCollections(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Collections fetch error:', error);
        }
      }
    };

    fetchCollections();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle search with debounce effect
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const featuredProducts = products.slice(0, 8);

  const handleSearchResult = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1a1a1a] mb-6 leading-tight">
              Discover Your Style
            </h1>
            <p className="text-lg text-[#666666] mb-8 leading-relaxed">
              Explore our curated collection of premium clothing and accessories. Find pieces that reflect your unique aesthetic.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button variant="primary">Shop Collection</Button>
              </Link>
              <Link to="/products">
                <Button variant="secondary">Browse More</Button>
              </Link>
            </div>
          </div>

          {/* Right: Search Bar & Featured */}
          <div>
            {/* Search Bar */}
            <div className="mb-8 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 border-b-2 border-[#e8e8e8] bg-transparent text-[#1a1a1a] placeholder-[#999999] focus:border-[#d4af88] focus:outline-none transition-colors"
                />
                <Search className="absolute right-4 top-4 w-5 h-5 text-[#d4af88]" />
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e8e8e8] shadow-lg z-10 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={handleSearchResult}
                      className="block px-5 py-3 hover:bg-[#f5f5f5] border-b border-[#e8e8e8] transition-colors"
                    >
                      <p className="font-semibold text-[#1a1a1a] text-sm">{product.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#d4af88] text-xs">${product.price}</p>
                        {product.isBestSeller && (
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-[#1a1a1a] bg-[#f5f5f5] border border-[#d4af88] px-1.5 py-0.5">
                            Best Seller
                          </span>
                        )}
                        {product.discountPercent > 0 && (
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-[#f5d6b4] bg-[#1a1a1a] px-1.5 py-0.5">
                            -{product.discountPercent}%
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Decorative Info */}
            <div className="bg-[#f5f5f5] p-6 border border-[#e8e8e8]">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-[#d4af88] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">Premium Selection</h3>
                  <p className="text-sm text-[#666666]">Carefully curated pieces for the modern aesthetic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <Section title="Featured Collection" subtitle="Shop our latest arrivals" centered>
        {status === 'loading' ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}
      </Section>

      {/* Categories Section */}
      <section className="bg-[#1a1a1a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-center mb-4 text-[#f5f5f5]">Shop by Category</h2>
          <p className="text-center text-[#d4af88] mb-12">Explore our curated collections</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(collections.length > 0 ? collections : [
              { slug: 'new-arrivals', name: 'New Arrivals', icon: '✨', productCount: 0 },
              { slug: 'best-sellers', name: 'Best Sellers', icon: '⭐', productCount: 0 },
              { slug: 'on-sale', name: 'On Sale', icon: '🎉', productCount: 0 }
            ]).map((cat) => (
              <Link key={cat.slug} to={`/products?collection=${cat.slug}`}>
                <div className="text-center text-white p-8 border border-[#d4af88] hover:bg-[#FFFFFF1A] transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">{cat.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 z-10 text-[#f5f5f5]">{cat.name}</h3>
                  <p className="text-[#d4af88] text-sm">
                    Browse collection{cat.productCount > 0 ? ` (${cat.productCount})` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Section dark centered>
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold mb-4">Exclusive Members Benefits</h2>
            <p className="text-[#d4af88] mb-8">Sign up to get early access to new collections and exclusive discounts</p>
            <Link to="/signup">
              <Button variant="accent">Join Our Community</Button>
            </Link>
          </div>
        </Section>
      )}
    </div>
  );
};

export default Home;
