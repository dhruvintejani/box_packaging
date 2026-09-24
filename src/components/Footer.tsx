import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-sm bg-[#c4883a] flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="8" width="18" height="12" rx="1" stroke="white" strokeWidth="1.5"/>
                  <path d="M6 8V5C6 3.895 6.895 3 8 3h6c1.105 0 2 .895 2 2v3" stroke="white" strokeWidth="1.5"/>
                  <path d="M2 12h18" stroke="white" strokeWidth="1.5"/>
                  <path d="M9 12v4M13 12v4" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-extrabold text-base leading-tight tracking-tight">PACKFORM</div>
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
                    className="text-sm text-[#9a9490] hover:text-white transition-colors cursor-pointer"
                  >
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
              className="flex items-center gap-2 bg-[#c4883a] hover:bg-[#b07a30] active:bg-[#9e6d28] text-white text-sm font-semibold px-4 py-2.5 rounded transition-all duration-150 cursor-pointer"
            >
              Try the Enquiry Demo
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
