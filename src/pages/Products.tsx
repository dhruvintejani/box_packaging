import { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import DemoBanner from '../components/DemoBanner';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import { products, productCategories } from '../data/products';
import type { ProductCategory } from '../types/product';

type SortOption = 'featured' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

export default function Products() {

  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (searchParams.get('focus') === 'search') {
      (window.innerWidth >= 1024 ? searchInputRef : mobileSearchInputRef).current?.focus();
    }
  }, [searchParams]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [search, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'All' || sortBy !== 'featured';

  const renderFilterSidebar = (mobile: boolean) => (
    <aside aria-label="Product filters">
      <h2 className="text-[#1a1a1a] font-bold text-base mb-4">Filter Products</h2>

      {/* Product Type */}
      <div className="mb-6">
        <h3 className="text-[#1a1a1a] font-semibold text-sm mb-3">Product Type</h3>
        <div className="space-y-2">
          {productCategories.map((cat) => {
            const isAll = cat === 'All';
            const isChecked = isAll ? selectedCategory === 'All' : selectedCategory === cat;
            return (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name={mobile ? 'mobile-category' : 'desktop-category'}
                  checked={isChecked}
                  onChange={() => setSelectedCategory(isAll ? 'All' : (cat as ProductCategory))}
                  className="w-4 h-4 rounded border-[#c0bab2] accent-[#c4883a] cursor-pointer"
                  aria-label={`Filter by ${cat}`}
                />
                <span className={`text-sm ${isChecked ? 'text-[#1a1a1a] font-medium' : 'text-[#5a5550]'} group-hover:text-[#1a1a1a] transition-colors`}>
                  {isAll ? 'All Products' : cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Apply / Clear */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setMobileFiltersOpen(false)}
          className="lg:hidden w-full bg-[#c4883a] hover:bg-[#b07a30] text-white text-sm font-semibold py-2.5 rounded transition-all cursor-pointer"
        >
          Close Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full text-[#c4883a] hover:text-[#b07a30] text-sm font-semibold py-2 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[70px]">
        <DemoBanner />
        {/* Hero */}
        <PageHero
          breadcrumbs={[{ label: 'Home' }, { label: 'Products' }]}
          title="Our Packaging"
          titleAccent="Products"
          subtitle="Explore our range of corrugated packaging solutions designed for strength, reliability and your unique business needs."
          image="/images/corrugated-stack.jpg"
          taglineLines={['STRONGER', 'SAFER', 'SMARTER', 'PACKAGING']}
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Mobile: Search + Filter toggle */}
          <div className="lg:hidden mb-6 flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9490]" />
              <input
                ref={mobileSearchInputRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 border border-[#e5e0d8] rounded-lg text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30 bg-white"
                aria-label="Search products"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9490] hover:text-[#1a1a1a] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#e5e0d8] rounded-lg text-sm font-medium text-[#1a1a1a] bg-white cursor-pointer hover:border-[#c4883a] transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#c4883a]" />
              )}
            </button>
          </div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden mb-6 border border-[#e5e0d8] rounded-lg"
              >
                <div className="p-4 bg-white">
                  {renderFilterSidebar(true)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-52 shrink-0">
              {/* Desktop Search */}
              <div className="relative mb-6">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9490]" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-8 pr-4 py-2 border border-[#e5e0d8] rounded-lg text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30 bg-white"
                  aria-label="Search products"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a9490] hover:text-[#1a1a1a] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {renderFilterSidebar(false)}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {filteredProducts.length}{' '}
                  <span className="font-normal text-[#5a5550]">
                    {filteredProducts.length === 1 ? 'product' : 'products'}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-sm text-[#5a5550] hidden sm:inline">
                    Sort by
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-[#e5e0d8] rounded-lg text-sm py-1.5 px-3 pr-8 focus:outline-none focus:border-[#c4883a] bg-white cursor-pointer text-[#1a1a1a] appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%235a5550' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product grid or empty state */}
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-[#1a1a1a] font-bold text-lg mb-2">No products found</h3>
                  <p className="text-[#5a5550] text-sm mb-6">
                    No packaging products match your search.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-[#c4883a] font-semibold text-sm hover:text-[#b07a30] transition-colors cursor-pointer border border-[#c4883a] px-4 py-2 rounded hover:bg-[#f5e8d0]"
                  >
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
