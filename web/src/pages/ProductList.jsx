import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../features/products/productsSlice';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config/api';

const COLLECTION_META = {
  'new-arrivals': {
    name: 'New Arrivals',
    subtitle: 'Fresh picks just added to our catalog',
    accentClass: 'text-[#f0c772]'
  },
  'best-sellers': {
    name: 'Best Sellers',
    subtitle: 'Most purchased and top-rated products',
    accentClass: 'text-[#d4af88]'
  },
  'on-sale': {
    name: 'On Sale',
    subtitle: 'Limited-time discounts on selected products',
    accentClass: 'text-[#e3a85f]'
  }
};

const COLLECTION_FALLBACK_PRODUCT_IDS = {
  'new-arrivals': [24, 23, 22, 21, 20, 19, 18, 17, 12, 11, 10, 9],
  'best-sellers': [3, 1, 11, 6, 5, 10, 21, 23, 19, 7, 2, 12],
  'on-sale': [2, 4, 7, 8, 12, 14, 16, 20, 22, 15, 18]
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const collectionParam = searchParams.get('collection');
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [categories, setCategories] = useState(['All']);
  const categoriesInitRef = useRef(false);
  const activeCollection = collectionParam ? COLLECTION_META[collectionParam] : null;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Fetch categories from backend - only once per component instance
  useEffect(() => {
    // If already initialized, skip
    if (categoriesInitRef.current) {
      return;
    }
    categoriesInitRef.current = true;

    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        // Only update state if component is still mounted
        if (isMounted && data && data.length > 0) {
          setCategories(['All', ...data]);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching categories:', error);
        }
      }
    };

    fetchCategories();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setFilterCategory(categoryParam || 'All');
  }, [categoryParam]);

  useEffect(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    // Collection filter from home tabs
    if (collectionParam) {
      const fallbackIds = COLLECTION_FALLBACK_PRODUCT_IDS[collectionParam] || [];
      result = result.filter((p) => {
        const hasCollectionMeta = Array.isArray(p.collections) && p.collections.includes(collectionParam);
        const hasFallbackMatch = fallbackIds.includes(p.id);
        return hasCollectionMeta || hasFallbackMatch;
      });
    }

    // Sort
    if (sortOrder === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'mostOrdered') {
      result.sort((a, b) => (b.weightedOrderScore || 0) - (a.weightedOrderScore || 0));
    } else if (collectionParam === 'on-sale') {
      result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }

    setFilteredProducts(result);
  }, [searchQuery, filterCategory, sortOrder, allProducts, collectionParam]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('All');
    setSortOrder('default');
  };

  const clearCollection = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('collection');
    setSearchParams(nextParams);
  };

  const hasActiveFilters = searchQuery || filterCategory !== 'All' || sortOrder !== 'default';

  if (status === 'loading') {
    return <div className="text-center py-24 text-[#666666]">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-serif font-bold text-[#1a1a1a] mb-4">
          {activeCollection ? activeCollection.name : 'Shop Our Collection'}
        </h1>
        <p className="text-[#666666]">
          {activeCollection ? activeCollection.subtitle : 'Discover curated pieces from our latest collection'}
        </p>
        {activeCollection && (
          <div className="mt-6 inline-flex items-center gap-3 bg-[#f5f5f5] border border-[#e8e8e8] px-4 py-2">
            <span className={`text-xs font-semibold uppercase tracking-wide ${activeCollection.accentClass}`}>
              {activeCollection.name} tab active
            </span>
            <button
              onClick={clearCollection}
              className="text-xs uppercase tracking-wide font-semibold text-[#1a1a1a] hover:text-[#d4af88] transition-colors"
            >
              View all products
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Section */}
      <div className="bg-[#f5f5f5] border-b border-[#e8e8e8] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 border-b-2 border-[#e8e8e8] bg-[#f5f5f5] text-[#1a1a1a] placeholder-[#999999] focus:border-[#d4af88] focus:outline-none transition-colors"
            />
            <Search className="absolute right-4 top-4 w-5 h-5 text-[#d4af88]" />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2 block">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-[#e8e8e8] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#d4af88] transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="w-full md:w-auto">
              <label className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2 block">
                Sort By
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-[#e8e8e8] bg-white text-[#1a1a1a] focus:outline-none focus:border-[#d4af88] transition-colors"
              >
                <option value="default">Newest</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="mostOrdered">Most Ordered</option>
              </select>
            </div>

            {/* Results Count & Clear */}
            <div className="flex-1 flex items-end justify-between">
              <p className="text-sm text-[#666666]">
                Showing <span className="font-semibold text-[#1a1a1a]">{filteredProducts.length}</span> results
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#d4af88] hover:text-[#1a1a1a] font-semibold uppercase tracking-wide transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Search className="w-16 h-16 text-[#e8e8e8] mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-2">No Products Found</h3>
            <p className="text-[#666666] mb-8 max-w-md mx-auto">
              {searchQuery
                ? 'No products match your search. Try different keywords.'
                : activeCollection
                  ? `No products found in ${activeCollection.name}. Try another tab or clear filters.`
                  : 'Try changing your filters or check back later.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={clearFilters}>
                Clear All Filters
              </Button>
              {activeCollection && (
                <Button variant="primary" onClick={clearCollection}>
                  View All Products
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
