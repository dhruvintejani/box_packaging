import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/quote', label: 'Build an Enquiry' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { selectedCount } = useEnquiry();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Escape closes the mobile navigation without trapping keyboard users.
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#e8ddce] bg-white/95 backdrop-blur-xl transition-[box-shadow,background-color] duration-300 ${
        scrolled ? 'shadow-[0_8px_25px_rgba(38,28,17,0.09)]' : 'shadow-[0_2px_12px_rgba(38,28,17,0.025)]'
      }`}
    >
      <a href="#main-content"
        className="absolute left-4 top-2 z-[60] -translate-y-20 rounded-lg bg-[#2e2822] px-4 py-2.5 text-sm font-bold text-white shadow-xl transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-[#c4883a]">
        Skip to content
      </a>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">
          {/* Logo */}
          <Link to="/" onClick={closeMobile} className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b17a36]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b7823f] shadow-[0_3px_9px_rgba(183,130,63,.18)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="8" width="18" height="12" rx="1" stroke="white" strokeWidth="1.5"/>
                <path d="M6 8V5C6 3.895 6.895 3 8 3h6c1.105 0 2 .895 2 2v3" stroke="white" strokeWidth="1.5"/>
                <path d="M2 12h18" stroke="white" strokeWidth="1.5"/>
                <path d="M9 12v4M13 12v4" stroke="white" strokeWidth="1.2"/>
              </svg>
            </div>
            <div>
              <div className="text-[#1a1a1a] font-extrabold text-lg leading-tight tracking-tight transition-colors group-hover:text-[#946026]">PACKFORM</div>
              <div className="text-[#9a9490] text-[9px] uppercase tracking-widest leading-tight font-medium">
                Packaging for a Brighter Tomorrow
              </div>
            </div>
          </Link>

          {/* Desktop Nav: interactive gold underline and subtle hover surfaces. */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `group/nav relative isolate inline-flex min-h-11 items-center justify-center overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold tracking-[-0.01em] transition-[color,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17a36] ${
                    isActive
                      ? 'bg-[#fff7e9] text-[#926027]'
                      : 'text-[#615950] hover:bg-[#faf3e8] hover:text-[#8e5c24]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{label}</span>
                    <span aria-hidden="true"
                      className={`pointer-events-none absolute inset-x-4 bottom-1 h-[2px] origin-center rounded-full bg-[#bd8a46] transition-transform duration-250 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('/products?focus=search')}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#6b6258] transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#faf1e3] hover:text-[#936127] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17a36]"
              aria-label="Search products"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => navigate('/quote')}
              className="group/cta inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#895922] bg-[#956126] px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(149,97,38,.18)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#79501f] hover:shadow-[0_8px_19px_rgba(121,80,31,.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17a36] active:translate-y-0"
            >
              Try the Enquiry Demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden="true">
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
                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-[#9b6624] transition-colors hover:bg-[#faf1e3] focus-visible:outline-2 focus-visible:outline-[#b17a36]"
                aria-label={`Enquiry basket, ${selectedCount} items`}
              >
                <ShoppingBag size={22} />
                <span className="absolute top-0.5 right-0.5 bg-[#c4883a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedCount}
                </span>
              </button>
            )}
            <button
              ref={menuToggleRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#25201c] transition-colors hover:bg-[#faf1e3] hover:text-[#946026] focus-visible:outline-2 focus-visible:outline-[#b17a36]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls={mobileOpen ? 'mobile-main-navigation' : undefined}
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
            id="mobile-main-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-t border-[#e8ddce] bg-[#fffdfa] shadow-[0_14px_30px_rgba(30,24,18,.13)]"
          >
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} onClick={closeMobile}
                  className={({ isActive }) =>
                    `group/mobile flex min-h-12 items-center justify-between rounded-xl border-l-[3px] px-4 py-3 text-sm font-bold transition-[background-color,color,border-color,padding] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17a36] ${
                      isActive
                        ? 'border-[#b7823f] bg-[#faf0df] text-[#875720]'
                        : 'border-transparent text-[#3e3831] hover:border-[#c38f4b] hover:bg-[#fbf2e6] hover:pl-5 hover:text-[#8b5e25]'
                    }`
                  }
                >
                  {label}
                  <span aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[#b7823f] opacity-0 transition-opacity group-hover/mobile:opacity-100" />
                </NavLink>
              ))}
              <div className="pt-3 mt-2 border-t border-[#e5e0d8]">
                <button
                  onClick={() => { navigate('/quote'); closeMobile(); }}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#956126] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#79501f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17a36]"
                >
                  Try the Enquiry Demo
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
