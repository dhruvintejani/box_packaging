import { Info } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="border-b border-[#ecd7b4] bg-[#fff7e9] px-4 py-2.5 text-center" role="note">
      <p className="mx-auto flex max-w-5xl items-start justify-center gap-2 text-xs leading-5 text-[#725020] sm:text-sm">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span><strong>Packaging website concept by PixelAura Technologies.</strong> Try it using sample details. No enquiry will be sent.</span>
      </p>
    </div>
  );
}
