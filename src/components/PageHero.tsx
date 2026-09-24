import { imageUrl } from '../utils/images';
import { Link } from 'react-router-dom';

interface PageHeroProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  image: string;
  tagline?: string;
  taglineLines?: string[];
}

export default function PageHero({
  breadcrumbs,
  title,
  titleAccent,
  subtitle,
  image,
  tagline,
  taglineLines,
}: PageHeroProps) {
  return (
    <div className="relative h-[220px] sm:h-[260px] lg:h-[300px] bg-[#1a1a1a] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${imageUrl(image)})` }}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent" aria-hidden="true" />

      <div className="relative h-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex items-center gap-2 mb-3" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => {
              const current = i === breadcrumbs.length - 1;
              const destination = crumb.href ?? (
                crumb.label === 'Home' ? '/' :
                crumb.label === 'Products' ? '/products' :
                crumb.label === 'Request a Quote' ? '/quote' : undefined
              );
              return (
                <span key={i} className="flex min-w-0 items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-sm text-[#b1a397]">›</span>}
                  {!current && destination ? (
                    <Link to={destination}
                      className="rounded-md py-1 text-sm text-[#ddd2c3] underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4883a]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={current ? 'page' : undefined}
                      className={`min-w-0 truncate text-sm ${current ? 'font-bold text-white' : 'text-[#d5c8b8]'}`}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              );
            }
          </nav>
        )}

        {/* Title */}
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
          {title}{' '}
          {titleAccent && <span className="text-[#c4883a]">{titleAccent}</span>}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[#c8c4be] text-sm sm:text-base max-w-md leading-relaxed">{subtitle}</p>
        )}

        {/* Tagline */}
        {taglineLines && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-right">
            <div className="text-[#5a5550] text-sm font-semibold tracking-widest uppercase leading-relaxed">
              {taglineLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <div className="mt-2 w-8 h-0.5 bg-[#5a5550] ml-auto"></div>
          </div>
        )}
        {tagline && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-right">
            <div className="text-[#5a5550] text-sm font-semibold tracking-widest uppercase leading-loose">
              {tagline}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
