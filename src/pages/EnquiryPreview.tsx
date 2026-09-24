import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Copy, Download, Trash2, Check, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import StepIndicator from '../components/StepIndicator';
import Modal from '../components/Modal';
import DemoBanner from '../components/DemoBanner';
import QuantityControl from '../components/QuantityControl';
import { safeQuantity } from '../utils/quantity';
import { getProductById } from '../data/products';
import { useEnquiry } from '../context/EnquiryContext';
import { formatEnquiryText } from '../utils/enquiryFormatter';
import { downloadTextFile } from '../utils/downloadText';

const STEPS = [
  { number: 1, label: 'Select Products' },
  { number: 2, label: 'Specify Requirements' },
  { number: 3, label: 'Your Details' },
  { number: 4, label: 'Preview Enquiry' },
];

const PLY_LABELS: Record<string, string> = {
  '3-ply': '3-ply Corrugated Board',
  '5-ply': '5-ply Corrugated Board',
  '7-ply': '7-ply Corrugated Board',
  'not-sure': 'Not sure',
};

const PRINTING_LABELS: Record<string, string> = {
  'no-printing': 'No printing',
  'printing-required': 'Printing required',
  'not-sure': 'Not sure',
};

export default function EnquiryPreview() {
  const navigate = useNavigate();
  const { enquiry, removeProduct, clearEnquiry, updateSpecifications } = useEnquiry();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showClearModal, setShowClearModal] = useState(false);

  const { selectedProductIds, specifications, customerDetails } = enquiry;

  const handleCopy = async () => {
    const text = formatEnquiryText(enquiry);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  const handleDownload = () => {
    const text = formatEnquiryText(enquiry);
    downloadTextFile(text, 'packform-enquiry.txt');
  };

  const handleClearConfirm = () => {
    clearEnquiry();
    setShowClearModal(false);
    navigate('/');
  };

  const hasDimensions = (productId: string) => {
    const s = specifications[productId];
    if (!s) return false;
    return (
      (s.length && s.length.trim() !== '') ||
      (s.width && s.width.trim() !== '') ||
      (s.height && s.height.trim() !== '')
    );
  };

  const formatDimensions = (productId: string) => {
    const s = specifications[productId];
    if (!s) return 'Not provided';
    const l = s.length && s.length.trim() ? `${s.length}` : '—';
    const w = s.width && s.width.trim() ? `${s.width}` : '—';
    const h = s.height && s.height.trim() ? `${s.height}` : '—';
    return `${l} × ${w} × ${h} mm`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[70px]">
        <DemoBanner />
        {/* Hero */}
        <PageHero
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Request a Quote' },
            { label: 'Review Enquiry' },
          ]}
          title="Review Your"
          titleAccent="Enquiry"
          subtitle="Preview your sample request. Edit the details, copy the summary or download it — no actual enquiry will be sent."
          image="/images/hero-boxes.jpg"
          taglineLines={['YOUR', 'IDEAS', 'OUR', 'PACKAGING']}
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Step indicator */}
          <div className="mb-8">
            <StepIndicator steps={STEPS} currentStep={4} />
          </div>

          {/* Demo Notice */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4"
            role="alert"
          >
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-semibold text-sm">Demo preview — this enquiry has not been sent.</p>
              <p className="text-amber-700 text-xs mt-0.5">
                This is a demonstration. No data has been transmitted to any system.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main: Selected products */}
            <div className="flex-1 min-w-0">
              {/* Selected products header */}
              <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[#1a1a1a] font-extrabold text-xl sm:text-2xl">
                    Selected Products ({selectedProductIds.length})
                  </h2>
                  <p className="text-[#5a5550] text-sm mt-0.5">
                    Review your selected products and specifications. You can go back and make changes if needed.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/quote', { state: { returnStep: 2 } })}
                  className="flex items-center gap-1.5 text-[#c4883a] text-sm font-semibold hover:text-[#b07a30] transition-colors cursor-pointer whitespace-nowrap ml-4"
                >
                  <Edit2 size={14} />
                  Edit Enquiry
                </button>
              </div>

              {selectedProductIds.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-[#e5e0d8] rounded-xl">
                  <p className="text-[#9a9490] text-sm mb-4">Your enquiry is empty.</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-[#c4883a] font-semibold text-sm cursor-pointer hover:underline"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                <div className="border border-[#e5e0d8] rounded-xl overflow-hidden">
                  {/* Table header */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto] bg-[#f8f6f2] border-b border-[#e5e0d8] px-4 py-3">
                    <span className="text-xs font-semibold text-[#5a5550] uppercase tracking-wide">Product</span>
                    <span className="text-xs font-semibold text-[#5a5550] uppercase tracking-wide">Specifications</span>
                    <span className="text-xs font-semibold text-[#5a5550] uppercase tracking-wide">Quantity</span>
                    <span className="text-xs font-semibold text-[#5a5550] uppercase tracking-wide">Actions</span>
                  </div>

                  {selectedProductIds.map((productId, index) => {
                    const product = getProductById(productId);
                    const specs = specifications[productId];
                    if (!product || !specs) return null;

                    return (
                      <motion.div
                        key={productId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-4 sm:gap-0 p-4 border-b border-[#e5e0d8] last:border-0 items-start sm:items-center"
                      >
                        {/* Product info */}
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f8f6f2] border border-[#e5e0d8] shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const t = e.target as HTMLImageElement;
                                t.style.display = 'none';
                                t.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem">📦</div>';
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-[#1a1a1a] font-bold text-sm">{product.name}</h3>
                            <p className="text-[#9a9490] text-xs mt-0.5 leading-snug max-w-[180px]">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Specifications */}
                        <div className="sm:px-4">
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                            <span className="text-[#9a9490]">Size (L×W×H)</span>
                            <span className="text-[#1a1a1a] font-medium">
                              {hasDimensions(productId)
                                ? formatDimensions(productId)
                                : 'Not provided — see notes'}
                            </span>

                            <span className="text-[#9a9490]">Material</span>
                            <span className="text-[#1a1a1a] font-medium">{PLY_LABELS[specs.plyPreference]}</span>

                            <span className="text-[#9a9490]">Printing</span>
                            <span className="text-[#1a1a1a] font-medium">{PRINTING_LABELS[specs.printing]}</span>

                            {specs.whatWillBePacked && (
                              <>
                                <span className="text-[#9a9490]">Content</span>
                                <span className="text-[#1a1a1a] font-medium">{specs.whatWillBePacked}</span>
                              </>
                            )}

                            {specs.additionalRequirements && (
                              <>
                                <span className="text-[#9a9490]">Notes</span>
                                <span className="text-[#1a1a1a] font-medium leading-snug">{specs.additionalRequirements}</span>
                              </>
                            )}

                            {!hasDimensions(productId) && !specs.whatWillBePacked && !specs.additionalRequirements && (
                              <>
                                <span className="text-[#9a9490] col-span-2 italic">Dimensions: Not provided — requirement described in notes</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="sm:px-4">
                          <span className="text-[#1a1a1a] font-bold text-sm">
                            <QuantityControl quantity={safeQuantity(specs.quantity)} compact
                              onChange={(quantity) => updateSpecifications(productId, { quantity })}
                              label={`Quantity for ${product.name} in preview`} />
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeProduct(productId)}
                            className="w-8 h-8 rounded-lg border border-[#e5e0d8] flex items-center justify-center text-[#9a9490] hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Guidance on editing notes */}
              <div className="mt-4 border border-dashed border-[#e5e0d8] rounded-xl p-4 flex items-start gap-3 bg-[#f8f6f2]">
                <div className="w-8 h-8 rounded border border-[#e5e0d8] bg-white flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="#9a9490" strokeWidth="1.2"/>
                    <path d="M5 6h6M5 9h4" stroke="#9a9490" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#1a1a1a] font-semibold text-sm">Additional Notes (Optional)</p>
                  <p className="text-[#9a9490] text-xs mt-1">
                    Add or update these in the requirements step before copying or downloading your enquiry.
                  </p>
                </div>
                <button type="button" onClick={() => navigate('/quote', { state: { returnStep: 2 } })}
                  className="ml-auto min-h-11 shrink-0 rounded-lg border border-[#c4883a] px-3 py-2 text-xs font-bold text-[#9b6624] hover:bg-[#fff3df]">
                  Edit notes
                </button>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap print:hidden">
                <button
                  onClick={handleCopy}
                  className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all sm:w-auto ${
                    copyState === 'copied'
                      ? 'border-green-400 bg-green-50 text-green-700'
                      : copyState === 'error'
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : 'border-[#e5e0d8] bg-white text-[#1a1a1a] hover:border-[#c4883a] hover:text-[#c4883a]'
                  }`}
                >
                  {copyState === 'copied' ? (
                    <>
                      <Check size={15} />
                      Copied
                    </>
                  ) : copyState === 'error' ? (
                    <>
                      <AlertCircle size={15} />
                      Copy failed
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Copy Summary
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1a1a] transition-all hover:border-[#c4883a] hover:text-[#c4883a] sm:w-auto"
                >
                  <Download size={15} />
                  Download .txt
                </button>

                <button
                  onClick={() => setShowClearModal(true)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e5e0d8] bg-white px-4 py-2.5 text-sm font-medium text-[#5a5550] transition-all hover:border-red-300 hover:text-red-600 sm:ml-auto sm:w-auto"
                >
                  <Trash2 size={15} />
                  Clear Enquiry
                </button>
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="w-full lg:w-72 shrink-0 space-y-6">
              {/* Your Details */}
              <div className="bg-white border border-[#e5e0d8] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#1a1a1a] font-bold text-base">Your Details</h3>
                  <button
                  onClick={() => navigate('/quote', { state: { returnStep: 3 } })}
                  className="flex items-center gap-1 text-[#c4883a] text-xs font-semibold hover:text-[#b07a30] cursor-pointer"
                >
                  <Edit2 size={12} />
                  Edit
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Name', value: customerDetails.contactName },
                    { label: 'Company Name', value: customerDetails.companyName },
                    { label: 'Email Address', value: customerDetails.email },
                    { label: 'Phone Number', value: customerDetails.phone },
                    { label: 'Delivery City', value: customerDetails.deliveryCity },
                  ].map(({ label, value }) => (
                    value ? (
                      <div key={label} className="grid grid-cols-2 gap-2">
                        <span className="text-[#9a9490] text-xs">{label}</span>
                        <span className="text-[#1a1a1a] font-medium text-xs">{value}</span>
                      </div>
                    ) : null
                  ))}
                  {!customerDetails.contactName && (
                    <p className="text-[#9a9490] text-xs italic">No details entered yet.</p>
                  )}
                </div>
              </div>

              {/* No fake "Submit Enquiry" or quotation response promises. */}
              <div className="rounded-xl border border-[#ead5af] bg-[#fffaf3] p-5">
                <h3 className="mb-3 text-base font-bold text-[#1a1a1a]">Your enquiry is ready to preview</h3>
                <p className="mb-4 text-sm leading-6 text-[#5a5550]">
                  This is an interactive website concept. No manufacturer has received your details.
                  You can edit the sample request, copy it or download a text summary.
                </p>
                <div className="grid gap-2">
                  <button type="button" onClick={handleCopy}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c4883a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#ac742e]">
                    {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                    {copyState === 'copied' ? 'Copied to Clipboard' : 'Copy Enquiry Summary'}
                  </button>
                  <button type="button" onClick={handleDownload}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#dfceb4] bg-white px-4 py-2.5 text-sm font-bold text-[#755024] hover:bg-[#f8f1e5]">
                    <Download size={16} /> Download Enquiry (.txt)
                  </button>
                  <p className="pt-1 text-center text-xs text-[#886c43]">For demonstration only — no data is transmitted.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Clear Enquiry Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Enquiry?"
      >
        <p className="text-[#5a5550] text-sm mb-6 leading-relaxed">
          This will remove all selected products, specifications and contact details. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowClearModal(false)}
            className="flex-1 border border-[#e5e0d8] text-[#1a1a1a] text-sm font-medium py-2.5 rounded-lg hover:bg-[#f8f6f2] transition-colors cursor-pointer"
          >
            Keep Enquiry
          </button>
          <button
            onClick={handleClearConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Clear Enquiry
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
