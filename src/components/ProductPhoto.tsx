import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ProductPhotoProps {
  src: string;
  alt: string;
}

/**
 * The embedded JPG is shown in full (not tightly cropped) on phones.
 * An actual SVG box illustration remains visible if a browser cannot decode
 * the JPG; the gallery never degrades into an empty brown rectangle.
 */
export default function ProductPhoto({ src, alt }: ProductPhotoProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <figure
      data-testid="product-image-gallery"
      className="relative isolate flex aspect-[5/4] w-full min-w-0 items-center justify-center overflow-hidden rounded-[1.45rem] border border-[#e6d8c4] bg-gradient-to-br from-[#fffdf7] via-[#f7f0e5] to-[#e9dece] p-4 shadow-[0_18px_55px_rgba(50,35,17,0.08)] sm:aspect-[4/3] sm:p-8 lg:p-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/55 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#d2b084]/30 blur-3xl" />
      <span className="pointer-events-none absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-[#e8d9c4] bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#90642d] shadow-sm sm:left-6 sm:top-6">
        <span className="h-1.5 w-1.5 rounded-full bg-[#bf8848]" />
        Packaging collection
      </span>

      {status !== 'loaded' && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden={status !== 'error'}>
          <svg
            role={status === 'error' ? 'img' : undefined}
            aria-label={status === 'error' ? alt + ' packaging illustration' : undefined}
            viewBox="0 0 420 320"
            className="h-[75%] w-[78%] max-w-[390px] drop-shadow-xl"
            fill="none"
          >
            <ellipse cx="214" cy="278" rx="130" ry="22" fill="#ad8b63" opacity=".2" />
            <path d="M95 119L210 68L332 119L216 174L95 119Z" fill="#E7C69B" stroke="#9F7542" strokeWidth="3" strokeLinejoin="round" />
            <path d="M95 119L216 174V263L95 210V119Z" fill="#D6AA73" stroke="#9F7542" strokeWidth="3" strokeLinejoin="round" />
            <path d="M216 174L332 119V211L216 263V174Z" fill="#B98751" stroke="#9F7542" strokeWidth="3" strokeLinejoin="round" />
            <path d="M156 92L271 144L247 154L131 104L156 92Z" fill="#F6E8D5" stroke="#AC895D" strokeWidth="2" />
            <path d="M216 174V263M95 119L216 174L332 119" stroke="#9F7542" strokeWidth="3" />
            <path d="M118 181L166 203M118 194L152 209" stroke="#9C7043" strokeWidth="4" strokeLinecap="round" opacity=".6" />
          </svg>
          {status === 'error' && (
            <div className="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-2 rounded-lg bg-white/85 px-3 py-2 text-center text-xs font-semibold text-[#715a40]">
              <ImageOff size={14} /> Sample packaging illustration
            </div>
          )}
        </div>
      )}

      {status !== 'error' && (
        <img
          key={src}
          data-testid="product-photo"
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={'relative z-10 h-full w-full max-w-[620px] object-contain drop-shadow-[0_18px_20px_rgba(48,35,20,0.09)] transition-opacity duration-300 ' +
            (status === 'loaded' ? 'opacity-100' : 'opacity-0')}
        />
      )}
      <figcaption className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 text-center text-[10px] font-medium tracking-wide text-[#826b52] sm:bottom-5 sm:text-xs">
        Illustrative product photograph
      </figcaption>
    </figure>
  );
}
