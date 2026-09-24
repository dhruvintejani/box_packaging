import { useEffect, useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY, safeQuantity } from '../utils/quantity';

interface QuantityControlProps {
  quantity: number;
  onChange: (value: number) => void;
  label?: string;
  compact?: boolean;
}

/** One numeric quantity control shared by all product, quote and preview screens. */
export default function QuantityControl({
  quantity,
  onChange,
  label = 'Quantity',
  compact = false,
}: QuantityControlProps) {
  const id = useId();
  const safe = safeQuantity(quantity);
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => setDraft(null), [quantity]);

  const commit = () => {
    if (draft === null) return;
    onChange(safeQuantity(draft));
    setDraft(null);
  };

  const adjust = (delta: number) => {
    const from = draft && Number(draft) > 0 ? safeQuantity(draft) : safe;
    onChange(Math.min(MAX_QUANTITY, Math.max(1, from + delta)));
    setDraft(null);
  };

  return (
    <div className="min-w-0">
      <label htmlFor={id} className={compact ? 'sr-only' : 'mb-2 block text-sm font-semibold text-[#1a1a1a]'}>
        {label}
      </label>
      <div className={`flex min-w-0 items-center gap-2 ${compact ? '' : 'flex-wrap'}`}>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => adjust(-1)}
          disabled={safe <= 1 && (draft === null || Number(draft) <= 1)}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className={`${compact ? 'h-8 w-8' : 'h-11 w-11'} flex shrink-0 items-center justify-center rounded-lg border border-[#d8cfbf] bg-white text-[#1a1a1a] transition-colors hover:border-[#b47c32] hover:bg-[#f9f0e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4883a] disabled:cursor-not-allowed disabled:opacity-40`}>
          <Minus size={compact ? 13 : 17} aria-hidden="true" />
        </button>
        <input id={id} type="text" inputMode="numeric" autoComplete="off" pattern="[0-9]*" aria-label={label}
          value={draft ?? String(safe)}
          onChange={(event) => {
            const next = event.target.value.replace(/[^0-9]/g, '').slice(0, 7);
            setDraft(next);
            if (next && Number(next) > 0) onChange(safeQuantity(next));
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(); e.currentTarget.blur(); }
          }}
          className={`${compact ? 'h-8 w-[4.5rem] text-xs' : 'h-11 w-24 text-sm'} min-w-0 rounded-lg border border-[#d8cfbf] bg-white px-1 text-center font-semibold text-[#1a1a1a] focus:border-[#c4883a] focus:outline-none focus:ring-2 focus:ring-[#c4883a]/20`}
        />
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => adjust(1)}
          disabled={safe >= MAX_QUANTITY}
          aria-label={`Increase ${label.toLowerCase()}`}
          className={`${compact ? 'h-8 w-8' : 'h-11 w-11'} flex shrink-0 items-center justify-center rounded-lg border border-[#d8cfbf] bg-white text-[#1a1a1a] transition-colors hover:border-[#b47c32] hover:bg-[#f9f0e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4883a] disabled:cursor-not-allowed disabled:opacity-40`}>
          <Plus size={compact ? 13 : 17} aria-hidden="true" />
        </button>
        {!compact && <span className="text-sm text-[#756c62]">pcs</span>}
      </div>
    </div>
  );
}
