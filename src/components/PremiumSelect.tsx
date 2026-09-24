import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface PremiumSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label: string;
  compact?: boolean;
  className?: string;
}

interface PanelGeometry {
  left: number;
  width: number;
  maxHeight: number;
  top?: number;
  bottom?: number;
}

/** A branded, keyboard-accessible select whose menu escapes clipped containers. */
export default function PremiumSelect({ value, options, onChange, label, compact = false, className = '' }: PremiumSelectProps) {
  const uid = useId().replace(/:/g, '');
  const menuId = 'packform-select-' + uid;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [highlighted, setHighlighted] = useState(Math.max(0, selectedIndex));
  const [geometry, setGeometry] = useState<PanelGeometry | null>(null);
  const selected = options[selectedIndex];

  const positionMenu = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 18;
    const above = rect.top - 18;
    const wantedHeight = Math.min(344, 12 + options.length * 59);
    const placeAbove = below < Math.min(wantedHeight, 220) && above > below;
    const available = Math.max(65, placeAbove ? above : below);
    const width = Math.min(rect.width, window.innerWidth - 20);
    const left = Math.max(10, Math.min(rect.left, window.innerWidth - width - 10));
    setGeometry({
      left, width, maxHeight: Math.min(344, available),
      ...(placeAbove ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
    });
  }, [options.length]);

  useEffect(() => {
    if (!open) return;
    positionMenu();
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    const focusTimer = window.setTimeout(() => menuRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu, true);
      window.clearTimeout(focusTimer);
    };
  }, [open, positionMenu]);

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setHighlighted(index);
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };
  const openMenu = (index: number) => {
    setHighlighted(Math.max(0, Math.min(index, options.length - 1)));
    setOpen(true);
  };
  const handleKeys = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      if (open) { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (!open) openMenu(selectedIndex < 0 ? 0 : Math.max(0, selectedIndex + direction));
      else setHighlighted((current) => (current + direction + options.length) % options.length);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : options.length - 1;
      if (open) setHighlighted(index);
      else openMenu(index);
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault(); choose(highlighted);
    } else if (open && event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
      const found = options.findIndex((option) => option.label.toLowerCase().startsWith(event.key.toLowerCase()));
      if (found >= 0) setHighlighted(found);
    }
  };
  const panelStyle: CSSProperties | undefined = geometry ? {
    left: geometry.left, width: geometry.width, maxHeight: geometry.maxHeight,
    top: geometry.top, bottom: geometry.bottom,
  } : undefined;

  return (
    <div className={'min-w-0 ' + className}>
      <button ref={triggerRef} type="button" aria-label={label}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? menuId : undefined}
        onClick={() => open ? setOpen(false) : openMenu(selectedIndex >= 0 ? selectedIndex : 0)}
        onKeyDown={handleKeys}
        className={'group flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd8b47]/35 ' +
          (compact ? 'min-h-11 px-3.5 py-2 ' : 'min-h-12 px-4 py-2.5 ') +
          (open ? 'border-[#c4883a] bg-white ring-4 ring-[#c4883a]/10' : 'border-[#ded5c8] bg-white hover:border-[#b9925c] hover:bg-[#fffdf9]')}>
        <span className="min-w-0 truncate text-sm font-semibold text-[#28231f]">{selected?.label ?? 'Choose an option'}</span>
        <span className={'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ' +
          (open ? 'rotate-180 bg-[#f6ebd9] text-[#996627]' : 'bg-[#f7f3ee] text-[#796b58] group-hover:bg-[#f6ebd9]')}>
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </button>
      {open && geometry && createPortal(
        <div id={menuId} ref={menuRef} role="listbox" aria-label={label}
          aria-activedescendant={menuId + '-option-' + highlighted} tabIndex={-1}
          onKeyDown={handleKeys} style={panelStyle}
          className="fixed z-[1000] overflow-y-auto overscroll-contain rounded-2xl border border-[#e9dfd0] bg-white p-1.5 shadow-[0_18px_56px_rgba(32,25,17,.16),0_3px_12px_rgba(32,25,17,.08)] outline-none">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const active = index === highlighted;
            return (
              <div id={menuId + '-option-' + index} key={option.value} role="option"
                aria-selected={isSelected} onMouseEnter={() => setHighlighted(index)}
                onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}
                className={'flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors ' +
                  (active ? 'bg-[#f7edde] text-[#35271b]' : isSelected ? 'bg-[#fcf8f2] text-[#44301b]' : 'text-[#45403b] hover:bg-[#f9f5ee]')}>
                <span className="min-w-0">
                  <span className={'block text-sm leading-5 ' + (isSelected ? 'font-bold' : 'font-semibold')}>{option.label}</span>
                  {option.description && <span className="mt-0.5 block text-xs leading-4 text-[#786f65]">{option.description}</span>}
                </span>
                {isSelected && <Check size={17} strokeWidth={2.5} className="shrink-0 text-[#aa742d]" aria-hidden="true" />}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
