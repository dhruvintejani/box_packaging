import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import StepIndicator from '../components/StepIndicator';
import Modal from '../components/Modal';
import DemoBanner from '../components/DemoBanner';
import QuantityControl from '../components/QuantityControl';
import { products, getProductById } from '../data/products';
import { useEnquiry } from '../context/EnquiryContext';
import type { PlyPreference, PrintingPreference } from '../types/enquiry';

const STEPS = [
  { number: 1, label: 'Select Products' },
  { number: 2, label: 'Specify Requirements' },
  { number: 3, label: 'Your Details' },
  { number: 4, label: 'Preview Enquiry' },
];

const PLY_OPTIONS: { value: PlyPreference; label: string }[] = [
  { value: '3-ply', label: '3-ply' },
  { value: '5-ply', label: '5-ply' },
  { value: '7-ply', label: '7-ply' },
  { value: 'not-sure', label: 'Not sure' },
];

const PRINTING_OPTIONS: { value: PrintingPreference; label: string }[] = [
  { value: 'no-printing', label: 'No printing' },
  { value: 'printing-required', label: 'Printing required' },
  { value: 'not-sure', label: 'Not sure' },
];

// Products shown in step 1 selection (all products)
const STEP1_PRODUCTS = products;

const customerSchema = z
  .object({
    contactName: z.string().trim().min(1, 'Contact name is required.'),
    companyName: z.string().trim().min(1, 'Company name is required.'),
    email: z.string().trim().email('Enter a valid email address.').optional().or(z.literal('')), 
    phone: z.string().trim().refine(
      (value) => value === '' || (/^[+()0-9\s.\-]+$/.test(value) && value.replace(/\D/g, '').length >= 6 && value.replace(/\D/g, '').length <= 15),
      'Enter a valid phone number (6–15 digits).'
    ).optional(),
    deliveryCity: z.string().optional(),
  })
  .refine(
    (data) => (data.email && data.email.trim() !== '') || (data.phone && data.phone.trim() !== ''),
    {
      message: 'Enter an email address or phone number. At least one is required.',
      path: ['email'],
    }
  );

type CustomerFormData = z.infer<typeof customerSchema>;

export default function Quote() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { returnStep?: number } | null;
  const {
    enquiry,
    addProduct,
    removeProduct,
    isSelected,
    updateSpecifications,
    updateCustomerDetails,
    clearEnquiry,
    selectedCount,
  } = useEnquiry();

  const [currentStep, setCurrentStep] = useState(() => {
    if (selectedCount === 0) return 1;
    return locationState?.returnStep === 3 ? 3 : 2;
  });
  const [showClearModal, setShowClearModal] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      contactName: enquiry.customerDetails.contactName ?? '',
      companyName: enquiry.customerDetails.companyName ?? '',
      email: enquiry.customerDetails.email ?? '',
      phone: enquiry.customerDetails.phone ?? '',
      deliveryCity: enquiry.customerDetails.deliveryCity ?? '',
    },
    mode: 'onTouched',
  });

  const handleToggleProduct = (productId: string) => {
    if (isSelected(productId)) {
      removeProduct(productId);
    } else {
      addProduct(productId);
    }
    setStep1Error('');
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleStep1Next = () => {
    if (selectedCount === 0) {
      setStep1Error('Please select at least one product to continue.');
      return;
    }
    goToStep(2);
  };

  const handleStep2Next = () => {
    goToStep(3);
  };

  const handleStep3Next = async () => {
    const valid = await trigger();
    if (!valid) return;
    const values = getValues();
    updateCustomerDetails({
      contactName: values.contactName.trim(),
      companyName: values.companyName.trim(),
      email: values.email?.trim() ?? '',
      phone: values.phone?.trim() ?? '',
      deliveryCity: values.deliveryCity?.trim() ?? '',
    });
    navigate('/quote/preview');
  };

  const handleClearConfirm = () => {
    clearEnquiry();
    setShowClearModal(false);
    setCurrentStep(1);
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
          ]}
          title="Request a"
          titleAccent="Quote"
          subtitle="Explore a guided packaging enquiry using sample details. Preview, copy or download the result without sending anything."
          image="/images/corrugated-stack.jpg"
          taglineLines={['BETTER', 'PACKAGING', 'BRIGHTER', 'TOMORROW']}
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Step indicator */}
          <div className="mb-8 lg:mb-10">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>

          <div className="flex gap-8 items-start">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {/* ============ STEP 1: SELECT PRODUCTS ============ */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h2 className="text-[#1a1a1a] font-extrabold text-2xl sm:text-3xl mb-1">
                          1. Select Products
                        </h2>
                        <p className="text-[#5a5550] text-sm">
                          Choose the products you want to include in your enquiry. You can add multiple products.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/products')}
                        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-[#9b6624] transition-colors hover:text-[#754719]"
                      >
                        <ChevronLeft size={16} />
                        Back to Products
                      </button>
                    </div>

                    {step1Error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                        {step1Error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {STEP1_PRODUCTS.map((product) => {
                        const selected = isSelected(product.id);
                        return (
                          <motion.div
                            key={product.id}
                            layout
                            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                              selected
                                ? 'border-[#c4883a] bg-[#fdfaf6]'
                                : 'border-[#e5e0d8] bg-white hover:border-[#c4883a]/50'
                            }`}
                            onClick={() => handleToggleProduct(product.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleToggleProduct(product.id)}
                            aria-pressed={selected}
                            aria-label={`${selected ? 'Remove' : 'Select'} ${product.name}`}
                          >
                            {/* Checkbox */}
                            <div className="absolute top-3 left-3 z-10">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  selected
                                    ? 'bg-[#c4883a] border-[#c4883a]'
                                    : 'bg-white border-[#c0bab2]'
                                }`}
                              >
                                {selected && (
                                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Image */}
                            <div className="aspect-[4/3] bg-[#f8f6f2]">
                              <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.onerror = null;
                                  img.src = '/images/product-custom-box.jpg';
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="p-3">
                              <h3 className="text-[#1a1a1a] font-bold text-sm mb-1">{product.name}</h3>
                              <p className="text-[#5a5550] text-xs leading-relaxed">{product.shortDescription}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        onClick={() => setShowClearModal(true)}
                        className="flex min-h-11 w-full items-center justify-center rounded-lg border border-[#e5e0d8] px-4 py-2.5 text-sm font-semibold text-[#5a5550] transition-colors hover:bg-[#f8f6f2] sm:w-auto"
                      >
                        Cancel Enquiry
                      </button>
                      <button
                        onClick={handleStep1Next}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#976020] px-5 py-3 text-center text-sm font-bold leading-5 text-white shadow-sm transition-colors hover:bg-[#794919] sm:w-auto"
                      >
                        Next: Specify Requirements
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ============ STEP 2: SPECIFY REQUIREMENTS ============ */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-[#1a1a1a] font-extrabold text-2xl sm:text-3xl mb-1">
                          2. Specify Requirements
                        </h2>
                        <p className="text-[#5a5550] text-sm">
                          Fill in the packaging requirements for each selected product.
                        </p>
                      </div>
                      <button
                        onClick={() => goToStep(1)}
                        className="inline-flex min-h-11 items-center gap-1 self-start rounded-lg px-3 py-2 text-sm font-semibold text-[#9b6624] hover:bg-[#f8f1e5] hover:text-[#754719]"
                      >
                        <ChevronLeft size={14} />
                        Add more products
                      </button>
                    </div>

                    {enquiry.selectedProductIds.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[#e5e0d8] rounded-lg">
                        <p className="text-[#9a9490] text-sm mb-4">No products selected.</p>
                        <button
                          onClick={() => goToStep(1)}
                          className="text-[#c4883a] font-semibold text-sm cursor-pointer hover:underline"
                        >
                          Go back to select products
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {enquiry.selectedProductIds.map((productId) => {
                          const product = getProductById(productId);
                          const specs = enquiry.specifications[productId];
                          if (!product || !specs) return null;

                          return (
                            <div key={productId} className="bg-white border border-[#e5e0d8] rounded-xl overflow-hidden">
                              {/* Product header */}
                              <div className="flex items-center gap-3 p-4 border-b border-[#e5e0d8] bg-[#f8f6f2]">
                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-[#e5e0d8] shrink-0">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-[#1a1a1a] font-bold text-sm">{product.name}</h3>
                                  <p className="text-[#9a9490] text-xs">{product.category}</p>
                                </div>
                                <button
                                  onClick={() => removeProduct(productId)}
                                  className="text-[#9a9490] hover:text-red-500 transition-colors cursor-pointer p-1.5"
                                  aria-label={`Remove ${product.name} from enquiry`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              {/* Spec fields */}
                              <div className="p-4 sm:p-6">
                                {/* One shared control for keyboard, touch, manual entry and +/- */}
                                <div className="mb-5">
                                  <QuantityControl quantity={specs.quantity}
                                    onChange={(quantity) => updateSpecifications(productId, { quantity })}
                                    label={`Quantity for ${product.name}`} />
                                </div>

                                                                {/* Dimensions */}
                                <div className="mb-5">
                                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">
                                    Dimensions (mm) — optional
                                  </label>
                                  <p className="text-[#9a9490] text-xs mb-3">
                                    Don't know the dimensions? Describe what you need to pack in the notes below.
                                  </p>
                                  <div className="grid grid-cols-3 gap-3">
                                    {(['length', 'width', 'height'] as const).map((dim) => (
                                      <div key={dim}>
                                        <label className="block text-xs text-[#9a9490] mb-1 uppercase tracking-wide">
                                          {dim === 'length' ? 'L' : dim === 'width' ? 'W' : 'H'}
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          placeholder={dim === 'length' ? 'Length' : dim === 'width' ? 'Width' : 'Height'}
                                          value={specs[dim] ?? ''}
                                          onChange={(e) => updateSpecifications(productId, { [dim]: e.target.value })}
                                          className="w-full border border-[#e5e0d8] rounded py-2 px-3 text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30"
                                          aria-label={`${dim} in millimeters`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Ply preference */}
                                <div className="mb-5">
                                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                                    Ply preference
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {PLY_OPTIONS.map((opt) => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => updateSpecifications(productId, { plyPreference: opt.value })}
                                        className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                                          specs.plyPreference === opt.value
                                            ? 'bg-[#c4883a] border-[#c4883a] text-white'
                                            : 'bg-white border-[#e5e0d8] text-[#5a5550] hover:border-[#c4883a] hover:text-[#c4883a]'
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Printing */}
                                <div className="mb-5">
                                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                                    Printing
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {PRINTING_OPTIONS.map((opt) => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => updateSpecifications(productId, { printing: opt.value })}
                                        className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                                          specs.printing === opt.value
                                            ? 'bg-[#c4883a] border-[#c4883a] text-white'
                                            : 'bg-white border-[#e5e0d8] text-[#5a5550] hover:border-[#c4883a] hover:text-[#c4883a]'
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* What will be packed */}
                                <div className="mb-5">
                                  <label
                                    htmlFor={`pack-${productId}`}
                                    className="block text-sm font-semibold text-[#1a1a1a] mb-1"
                                  >
                                    What will be packed — optional
                                  </label>
                                  <input
                                    id={`pack-${productId}`}
                                    type="text"
                                    placeholder="E.g. glass bottles, electronics, clothing..."
                                    value={specs.whatWillBePacked ?? ''}
                                    onChange={(e) =>
                                      updateSpecifications(productId, { whatWillBePacked: e.target.value })
                                    }
                                    className="w-full border border-[#e5e0d8] rounded py-2 px-3 text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30"
                                  />
                                </div>

                                {/* Additional requirements */}
                                <div>
                                  <label
                                    htmlFor={`notes-${productId}`}
                                    className="block text-sm font-semibold text-[#1a1a1a] mb-1"
                                  >
                                    Additional requirements — optional
                                  </label>
                                  <textarea
                                    id={`notes-${productId}`}
                                    rows={3}
                                    placeholder="E.g. special requirements, delivery location, expected timeline, or describe dimensions if not specified above..."
                                    value={specs.additionalRequirements ?? ''}
                                    onChange={(e) =>
                                      updateSpecifications(productId, { additionalRequirements: e.target.value })
                                    }
                                    className="w-full border border-[#e5e0d8] rounded py-2 px-3 text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30 resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        onClick={() => goToStep(1)}
                        className="flex min-h-11 w-full items-center justify-center gap-1 rounded-lg border border-[#e5e0d8] px-4 py-2.5 text-sm font-semibold text-[#5a5550] transition-colors hover:bg-[#f8f6f2] sm:w-auto"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>
                      <button
                        onClick={handleStep2Next}
                        disabled={enquiry.selectedProductIds.length === 0}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#976020] px-5 py-3 text-center text-sm font-bold leading-5 text-white shadow-sm transition-colors hover:bg-[#794919] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        Next: Your Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ============ STEP 3: YOUR DETAILS ============ */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-[#1a1a1a] font-extrabold text-2xl sm:text-3xl mb-1">
                          3. Your Details
                        </h2>
                        <p className="text-[#5a5550] text-sm">
                          Use sample contact information to see how your request would look. Nothing is submitted.
                        </p>
                      </div>
                      <button
                        onClick={() => goToStep(2)}
                        className="inline-flex min-h-11 shrink-0 items-center gap-1 self-start text-sm font-semibold text-[#9b6624] transition-colors hover:text-[#754719]"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>
                    </div>

                    <form className="space-y-5 max-w-xl" noValidate onSubmit={(e) => { e.preventDefault(); void handleStep3Next(); }}>
                      {/* Contact Name */}
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                          Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactName"
                          type="text"
                          autoComplete="name"
                          {...register('contactName')}
                          className={`w-full border rounded py-2.5 px-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                            errors.contactName
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                              : 'border-[#e5e0d8] focus:border-[#c4883a] focus:ring-[#c4883a]/30'
                          }`}
                          aria-describedby={errors.contactName ? 'contactName-error' : undefined}
                          aria-invalid={!!errors.contactName}
                        />
                        {errors.contactName && (
                          <p id="contactName-error" className="mt-1 text-red-600 text-xs" role="alert">
                            {errors.contactName.message}
                          </p>
                        )}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="companyName"
                          type="text"
                          autoComplete="organization"
                          {...register('companyName')}
                          className={`w-full border rounded py-2.5 px-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                            errors.companyName
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                              : 'border-[#e5e0d8] focus:border-[#c4883a] focus:ring-[#c4883a]/30'
                          }`}
                          aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                          aria-invalid={!!errors.companyName}
                        />
                        {errors.companyName && (
                          <p id="companyName-error" className="mt-1 text-red-600 text-xs" role="alert">
                            {errors.companyName.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                          Email Address
                          <span className="text-[#9a9490] font-normal text-xs ml-1">(at least one of email or phone required)</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...register('email')}
                          className={`w-full border rounded py-2.5 px-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                            errors.email
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                              : 'border-[#e5e0d8] focus:border-[#c4883a] focus:ring-[#c4883a]/30'
                          }`}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-1 text-red-600 text-xs" role="alert">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                          Phone Number
                          <span className="text-[#9a9490] font-normal text-xs ml-1">(at least one of email or phone required)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          {...register('phone')}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                          className="w-full border border-[#e5e0d8] rounded py-2.5 px-3 text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30 transition-colors"
                        />
                        {errors.phone && <p role="alert" id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                      </div>

                      {/* Delivery City */}
                      <div>
                        <label htmlFor="deliveryCity" className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                          Delivery City — optional
                        </label>
                        <input
                          id="deliveryCity"
                          type="text"
                          autoComplete="address-level2"
                          {...register('deliveryCity')}
                          className="w-full border border-[#e5e0d8] rounded py-2.5 px-3 text-sm focus:outline-none focus:border-[#c4883a] focus:ring-1 focus:ring-[#c4883a]/30 transition-colors"
                        />
                      </div>
                    </form>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        onClick={() => goToStep(2)}
                        className="flex min-h-11 w-full items-center justify-center gap-1 rounded-lg border border-[#e5e0d8] px-4 py-2.5 text-sm font-semibold text-[#5a5550] transition-colors hover:bg-[#f8f6f2] sm:w-auto"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>
                      <button
                        onClick={handleStep3Next}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#976020] px-5 py-3 text-center text-sm font-bold leading-5 text-white shadow-sm transition-colors hover:bg-[#794919] sm:w-auto"
                      >
                        Preview Enquiry
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right sidebar */}
            <aside className="hidden lg:block w-72 shrink-0 sticky top-24 space-y-4">
              {/* Selected products panel */}
              <div className="bg-white border border-[#e5e0d8] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1a1a1a] text-sm">
                    Selected Products ({selectedCount})
                  </h3>
                  {selectedCount > 0 && (
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="text-[#c4883a] text-xs font-semibold hover:text-[#b07a30] cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {selectedCount === 0 ? (
                  <p className="text-[#9a9490] text-xs text-center py-4">No products selected yet.</p>
                ) : (
                  <div className="space-y-3">
                    {enquiry.selectedProductIds.map((pid) => {
                      const product = getProductById(pid);
                      const specs = enquiry.specifications[pid];
                      if (!product || !specs) return null;
                      return (
                        <div key={pid} className="flex items-center gap-3 py-2 border-b border-[#f0ece4] last:border-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f8f6f2] shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.onerror = null;
                                img.src = '/images/product-custom-box.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#1a1a1a] font-semibold text-xs leading-snug truncate">{product.name}</p>
                            <div className="mt-2">
                              <QuantityControl quantity={specs.quantity} compact
                                onChange={(quantity) => updateSpecifications(pid, { quantity })}
                                label={`Quantity for ${product.name} in summary`} />
                            </div>
                          </div>
                          <button
                            onClick={() => removeProduct(pid)}
                            className="text-[#c0bab2] hover:text-red-500 cursor-pointer transition-colors"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Need Help */}
              <div className="bg-[#f8f6f2] border border-[#e5e0d8] rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zM7 10.5v-3M7 6V4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-sm mb-1">Need another product?</h4>
                    <p className="text-[#5a5550] text-xs leading-relaxed mb-3">
                      The preview is flexible: add more items or write requirements in the notes.
                    </p>
                    <button type="button" onClick={() => goToStep(1)} className="flex min-h-11 items-center gap-1.5 rounded-lg border border-[#e5e0d8] bg-white px-3 py-2 text-xs font-semibold text-[#1a1a1a] transition-colors hover:border-[#c4883a]">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zM7 10.5v-3M7 6V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Browse catalogue
                    </button>
                  </div>
                </div>
              </div>

              {/* Sustainable */}
              <div className="bg-[#f5e8d0] border border-[#e8d4a0] rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Leaf size={24} className="text-[#1a1a1a] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-sm mb-1">
                      Sustainable Packaging for a Better Tomorrow
                    </h4>
                    <p className="text-[#5a5550] text-xs leading-relaxed">
                      Reliable. Customisable. Environmentally responsible.
                    </p>
                  </div>
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
          This will remove all selected products and entered information. This action cannot be undone.
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
