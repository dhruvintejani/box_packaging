import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { useEnquiry } from '../context/EnquiryContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addProduct, isSelected } = useEnquiry();
  const [imgError, setImgError] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'added' | 'exists'>('idle');
  const navigate = useNavigate();
  const selected = isSelected(product.id);

  const handleAdd = () => {
    if (selected) {
      navigate('/quote');
      return;
    }
    const added = addProduct(product.id);
    if (added) {
      setFeedback('added');
      setTimeout(() => setFeedback('idle'), 2000);
    }
  };

  return (
    <motion.div
      data-product-slug={product.slug}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#e9e0d5] bg-white shadow-[0_2px_16px_rgba(35,27,19,0.035)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#d4bc99] hover:shadow-[0_20px_40px_rgba(35,27,19,0.1)]"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-[#f8f6f2] overflow-hidden relative">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f0ece4]">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📦</div>
              <span className="text-[#9a9490] text-xs font-medium">{product.name}</span>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
          />
        )}
        <button type="button" onClick={() => navigate(`/products/${product.slug}`)}
          aria-label={`Open details for ${product.name}`}
          className="absolute inset-0 z-[1] cursor-pointer focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#c4883a]">
          <span className="sr-only">Explore {product.name}</span>
        </button>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#251d12]/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {selected && (
          <div className="absolute right-3 top-3 z-[2] flex h-7 w-7 items-center justify-center rounded-full bg-[#ad7837] text-white shadow-md">
            <Check size={14} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#c4883a] mb-1.5">
          {product.category}
        </span>
        <h3 className="text-[#1a1a1a] font-bold text-base leading-snug mb-1.5">
          {product.name}
        </h3>
        <p className="text-[#5a5550] text-sm leading-relaxed flex-1 mb-4">
          {product.shortDescription}
        </p>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2">
          <button type="button"
            onClick={() => navigate(`/products/${product.slug}`)}
            aria-label="View Product"
            className="group/view relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#2b2926] bg-[#292522] px-2.5 py-3 text-xs font-bold tracking-[0.01em] text-white shadow-[0_5px_12px_rgba(30,24,18,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ad8247] hover:bg-[#40352b] hover:shadow-[0_8px_17px_rgba(30,24,18,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bf8c45] active:translate-y-0 sm:text-sm xl:text-xs"
          >
            <span>View Product</span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c99a5d] text-[#292018] transition-transform duration-200 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5">
              <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </button>

          <button type="button"
            onClick={handleAdd}
            aria-label={selected ? `View enquiry containing ${product.name}` : `Add ${product.name} to enquiry`}
            className={`inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl border px-2.5 py-3 text-xs font-bold tracking-[0.005em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4883a] sm:text-sm xl:text-xs ${
              selected
                ? 'border-[#b89662] bg-[#f8eddb] text-[#795021] hover:bg-[#f4e3c8]'
                : 'border-[#d6b98d] bg-[#fffaf3] text-[#785023] hover:-translate-y-0.5 hover:border-[#ae8246] hover:bg-[#f8ead5] hover:shadow-sm'
            }`}
          >
            {selected ? <><Check size={15} strokeWidth={2.5} aria-hidden="true" /> View Enquiry</> :
              <><ShoppingBag size={15} strokeWidth={2.2} aria-hidden="true" />
                {feedback === 'added' ? 'Added' : 'Add to Enquiry'}</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
