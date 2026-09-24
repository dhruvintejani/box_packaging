import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="group mb-4 inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9ab64]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#b7823f] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="8" width="18" height="12" rx="1" stroke="white" strokeWidth="1.5"/>
                  <path d="M6 8V5C6 3.895 6.895 3 8 3h6c1.105 0 2 .895 2 2v3" stroke="white" strokeWidth="1.5"/>
                  <path d="M2 12h18" stroke="white" strokeWidth="1.5"/>
                  <path d="M9 12v4M13 12v4" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <div>
                <div className="text-base font-extrabold leading-tight tracking-tight text-white transition-colors group-hover:text-[#e6b876]">PACKFORM</div>
                <div className="text-[#9a9490] text-[9px] uppercase tracking-widest leading-tight font-medium">
                  Packaging for a Brighter Tomorrow
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/quote', label: 'Build a Sample Enquiry' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group/footer inline-flex min-h-9 items-center gap-1.5 rounded-lg py-1 text-sm text-[#c7c0b6] transition-colors duration-200 hover:text-[#f4cd95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9ab64]"
                  >
                    <span aria-hidden="true" className="h-px w-0 bg-[#e6b876] transition-[width] duration-200 group-hover/footer:w-2" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Approach */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Our Approach</h3>
            <ul className="space-y-2.5">
              {['Sustainability', 'Quality', 'Custom Manufacturing'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-[#9a9490]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Explore the Demo</h3>
            <p className="text-sm text-[#9a9490] mb-4">Try a guided packaging quotation using sample information.</p>
            <button
              onClick={() => navigate('/quote')}
              className="group/footercta inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#a36b2c] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#c48b41] hover:shadow-[0_8px_20px_rgba(0,0,0,.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9ab64] active:translate-y-0"
            >
              Try the Enquiry Demo
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover/footercta:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Demo By */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Demo by</h3>
            <p className="text-[#c4883a] font-bold text-base leading-snug">PixelAura Technologies</p>
            <div className="mt-1 w-8 h-0.5 bg-[#c4883a]"></div>
            <p className="text-[#9a9490] text-sm mt-2">Packaging Website Demo</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2d2d2d]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#9a9490] text-xs">© 2026 PACKFORM • Packaging website concept.</p>
          <p className="text-xs leading-5 text-[#b6a99a] text-center sm:text-right">
            Concept by PixelAura Technologies • All interactions are simulated; no enquiry is sent.
          </p>
        </div>
      </div>
    </footer>
  );
}
