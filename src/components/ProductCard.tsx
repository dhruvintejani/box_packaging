import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
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
      setFeedback('exists');
      setTimeout(() => setFeedback('idle'), 2000);
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      className="bg-white border border-[#e5e0d8] rounded-lg overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-200"
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
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        )}
        {selected && (
          <div className="absolute top-2 right-2 bg-[#c4883a] text-white rounded-full w-6 h-6 flex items-center justify-center">
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
        <div className="flex items-center justify-between gap-2 mt-auto">
          <button
            onClick={() => navigate(`/products`)}
            className="text-[#c4883a] text-sm font-semibold hover:text-[#b07a30] transition-colors cursor-pointer flex items-center gap-1"
          >
            View Details
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded border transition-all duration-150 cursor-pointer ${
              selected
                ? 'bg-[#f5e8d0] border-[#c4883a] text-[#c4883a]'
                : feedback === 'idle'
                ? 'bg-white border-[#e5e0d8] text-[#1a1a1a] hover:border-[#c4883a] hover:text-[#c4883a]'
                : 'bg-[#f5e8d0] border-[#c4883a] text-[#c4883a]'
            }`}
            aria-label={selected ? `${product.name} already in enquiry` : `Add ${product.name} to enquiry`}
          >
            {selected ? (
              <>
                <Check size={14} />
                Added
              </>
            ) : feedback === 'exists' ? (
              <>
                <Check size={14} />
                Already added
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                Add to Enquiry
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
