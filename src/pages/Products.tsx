import { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import DemoBanner from '../components/DemoBanner';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import PremiumSelect from '../components/PremiumSelect';
import { products, productCategories } from '../data/products';

type SortOption = 'featured' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

const CATEGORY_OPTIONS = productCategories.map((category) => ({
  value: category,
  label: category === 'All' ? 'All products' : category,
  description: category === 'All' ? 'Explore the complete sample catalogue' : undefined,
}));

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
    <aside aria-label={mobile ? 'Mobile product filters' : 'Product filters'}
      className="rounded-2xl border border-[#e8dfd2] bg-gradient-to-b from-[#fffcf8] to-white p-4 shadow-sm">
      <div className="mb-5 border-b border-[#ece5da] pb-4">
        <h2 className="text-base font-extrabold tracking-tight text-[#28231f]">Refine your search</h2>
        <p className="mt-1 text-xs leading-5 text-[#756b5f]">
          Discover the right box for your packaging requirements.
        </p>
      </div>
      <div className="mb-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.11em] text-[#837565]">Product category</p>
        <PremiumSelect
          value={selectedCategory} label="Product category"
          options={CATEGORY_OPTIONS}
          onChange={(value) => setSelectedCategory(value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[#ece5da] pt-4">
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-[#d8c3a6] bg-white px-3 text-sm font-bold text-[#8b5923] transition-colors hover:bg-[#fff2df]">
            Clear filters
          </button>
        )}
        {mobile && (
          <button type="button" onClick={() => setMobileFiltersOpen(false)}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#a46c29] px-3 text-sm font-bold text-white transition-colors hover:bg-[#82521d]">
            Show {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </button>
        )}
        {!mobile && !hasActiveFilters && (
          <p className="text-xs leading-5 text-[#85796d]">Showing all categories</p>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 outline-none lg:pt-[70px]">
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
          {/* Keep search and category controls visible below the fixed mobile header. */}
          <div data-testid="mobile-catalogue-tools"
            className="sticky top-16 z-40 -mx-4 mb-6 border-b border-[#e8dfd2] bg-white/95 px-4 py-3 shadow-[0_5px_15px_rgba(30,23,13,.05)] backdrop-blur-lg sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex gap-3">
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
              type="button"
              aria-expanded={mobileFiltersOpen}
              aria-controls="mobile-filter-panel"
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#dbcab1] bg-white px-3.5 py-2 text-sm font-bold text-[#423328] shadow-sm transition-colors hover:border-[#b99059] focus-visible:outline-2 focus-visible:outline-[#c4883a]"
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
                id="mobile-filter-panel"
                className="mt-3 max-h-[calc(100dvh-12rem)] overflow-y-auto rounded-xl border border-[#e5e0d8] bg-white shadow-lg"
              >
                <div className="p-4 bg-white">
                  {renderFilterSidebar(true)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div data-testid="desktop-catalogue-tools"
              className="sticky top-[92px] hidden max-h-[calc(100dvh-110px)] w-52 shrink-0 self-start overflow-y-auto overscroll-contain pb-3 lg:block">
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
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {filteredProducts.length}{' '}
                  <span className="font-normal text-[#5a5550]">
                    {filteredProducts.length === 1 ? 'product' : 'products'}
                  </span>
                </p>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="hidden shrink-0 text-xs font-semibold text-[#817569] sm:inline">Sort by</span>
                  <PremiumSelect
                    value={sortBy}
                    onChange={(value) => setSortBy(value as SortOption)}
                    options={SORT_OPTIONS}
                    label="Sort products"
                    compact
                    className="w-[158px] sm:w-[172px]"
                  />
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
