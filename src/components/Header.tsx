import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/quote', label: 'Request a Quote' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { selectedCount } = useEnquiry();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-b border-[#e5e0d8]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">
          {/* Logo */}
          <Link to="/" onClick={closeMobile} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-sm bg-[#c4883a] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="8" width="18" height="12" rx="1" stroke="white" strokeWidth="1.5"/>
                <path d="M6 8V5C6 3.895 6.895 3 8 3h6c1.105 0 2 .895 2 2v3" stroke="white" strokeWidth="1.5"/>
                <path d="M2 12h18" stroke="white" strokeWidth="1.5"/>
                <path d="M9 12v4M13 12v4" stroke="white" strokeWidth="1.2"/>
              </svg>
            </div>
            <div>
              <div className="text-[#1a1a1a] font-extrabold text-lg leading-tight tracking-tight">PACKFORM</div>
              <div className="text-[#9a9490] text-[9px] uppercase tracking-widest leading-tight font-medium">
                Packaging for a Brighter Tomorrow
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[#1a1a1a] font-semibold border-b-2 border-[#c4883a] rounded-none'
                      : 'text-[#5a5550] hover:text-[#1a1a1a]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('/products')}
              className="text-[#5a5550] hover:text-[#1a1a1a] transition-colors cursor-pointer p-2"
              aria-label="Search products"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => navigate('/quote')}
              className="flex items-center gap-2 bg-[#c4883a] hover:bg-[#b07a30] active:bg-[#9e6d28] text-white text-sm font-semibold px-4 py-2.5 rounded transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
            >
              Start an Enquiry
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {selectedCount > 0 && (
                <span className="ml-0.5 bg-white text-[#c4883a] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {selectedCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right */}
          <div className="flex lg:hidden items-center gap-2">
            {selectedCount > 0 && (
              <button
                onClick={() => navigate('/quote')}
                className="relative p-2 text-[#c4883a] cursor-pointer"
                aria-label={`Enquiry basket, ${selectedCount} items`}
              >
                <ShoppingBag size={22} />
                <span className="absolute top-0.5 right-0.5 bg-[#c4883a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedCount}
                </span>
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#1a1a1a] cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-t border-[#e5e0d8]"
          >
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium rounded-lg cursor-pointer ${
                      isActive
                        ? 'bg-[#f5e8d0] text-[#c4883a] font-semibold'
                        : 'text-[#1a1a1a] hover:bg-[#f8f6f2]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-3 mt-2 border-t border-[#e5e0d8]">
                <button
                  onClick={() => { navigate('/quote'); closeMobile(); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#c4883a] hover:bg-[#b07a30] text-white text-sm font-semibold px-4 py-3 rounded-lg transition-all cursor-pointer"
                >
                  Start an Enquiry
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {selectedCount > 0 && (
                    <span className="ml-1 bg-white text-[#c4883a] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {selectedCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
