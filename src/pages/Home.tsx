import { imageUrl } from '../utils/images';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Shield, Settings, Truck, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import DemoBanner from '../components/DemoBanner';
import { products } from '../data/products';



const FEATURED_PRODUCTS = products.filter((p) => p.featured).slice(0, 6);

const VALUE_PROPS = [
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    subtitle: 'A smarter choice for tomorrow.',
  },
  {
    icon: Shield,
    title: 'Reliable Quality',
    subtitle: 'Consistent. Dependable. Trusted.',
  },
  {
    icon: Settings,
    title: 'Custom Solutions',
    subtitle: 'Designed around your needs.',
  },
  {
    icon: Truck,
    title: 'Ready for What\'s Next',
    subtitle: 'Packaging that keeps you moving.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[70px]">
        <DemoBanner />
        {/* HERO */}
        <section
          className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] bg-[#1a1a1a] overflow-hidden flex items-center"
          aria-label="Hero banner"
        >
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{
              backgroundImage: `url(${imageUrl('/images/hero-boxes.jpg')})`,
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/70 to-transparent" aria-hidden="true" />

          {/* Diagonal split right */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block opacity-60"
            style={{
              backgroundImage: `url(${imageUrl('/images/product-shipping-carton.jpg')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block"
            style={{
              background: 'linear-gradient(to right, #1a1a1a 0%, transparent 30%)',
              clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[#c4883a] text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              >
                Corrugated Packaging Solutions
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6"
              >
                Stronger Packaging
                <br />
                for a{' '}
                <span className="text-[#c4883a]">Brighter</span>
                <br />
                <span className="text-[#c4883a]">Tomorrow</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.16 }}
                className="text-[#c8c4be] text-base sm:text-lg leading-relaxed mb-8 max-w-md"
              >
                High-quality corrugated boxes for businesses that move the world. Reliable. Customisable. Built for what's next.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={() => navigate('/products')}
                  className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#c4883a] sm:w-auto hover:bg-[#b07a30] active:bg-[#9e6d28] text-white font-semibold px-6 py-3 rounded transition-all duration-150 cursor-pointer shadow-md hover:shadow-lg"
                >
                  Explore Products
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/quote')}
                  className="flex min-h-12 w-full items-center justify-center gap-2 bg-transparent sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] font-semibold px-6 py-3 rounded transition-all duration-150 cursor-pointer"
                >
                  Build Sample Enquiry
                </button>
              </motion.div>
            </div>


          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section className="py-14 lg:py-20 bg-white" aria-labelledby="products-heading">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div>
                <p className="text-[#9a9490] text-xs font-semibold uppercase tracking-widest mb-2">
                  Our Products
                </p>
                <h2 id="products-heading" className="text-[#1a1a1a] text-3xl sm:text-4xl font-extrabold leading-tight">
                  Packaging Solutions
                  <br />
                  for Every Need
                </h2>
              </div>
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-12">
                <p className="text-[#5a5550] text-sm leading-relaxed max-w-xs">
                  From standard shipping cartons to fully customised designs, we manufacture corrugated packaging that protects, performs and represents your brand.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-1.5 text-[#c4883a] font-semibold text-sm hover:text-[#b07a30] transition-colors cursor-pointer whitespace-nowrap"
                >
                  View All Products
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Product showcase strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#e5e0d8] rounded-lg overflow-hidden border border-[#e5e0d8]">
              {FEATURED_PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  className="bg-white flex flex-col group cursor-pointer"
                  onClick={() => navigate(`/products/${product.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/products/${product.slug}`)}
                  aria-label={`View ${product.name}`}
                >
                  <div className="aspect-square bg-[#f8f6f2] overflow-hidden">
                    {imgErrors[product.id] ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">📦</span>
                      </div>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={() => handleImgError(product.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-3 border-t border-[#e5e0d8]">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[#1a1a1a] font-bold text-xs leading-snug flex-1">
                        {product.name}
                      </h3>
                      <ChevronRight size={12} className="text-[#c4883a] shrink-0 ml-1" />
                    </div>
                    <p className="text-[#9a9490] text-[11px] leading-snug">
                      {product.shortDescription.split('.')[0]}.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="bg-[#f0ece4] py-10 lg:py-12" aria-label="Why choose Packform">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#d8d4cc]">
              {VALUE_PROPS.map(({ icon: Icon, title, subtitle }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="flex items-start gap-4 px-6 py-5 lg:py-6 first:pl-0 last:pr-0"
                >
                  <div className="shrink-0 text-[#1a1a1a]">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[#1a1a1a] font-bold text-sm mb-0.5">{title}</h3>
                    <p className="text-[#5a5550] text-xs leading-relaxed">{subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
