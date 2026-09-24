import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { products } from '../data/products';
import { safeQuantity } from '../utils/quantity';
import type { EnquiryState, ProductSpecifications, CustomerDetails, PlyPreference, PrintingPreference } from '../types/enquiry';

interface EnquiryContextValue {
  enquiry: EnquiryState;
  addProduct: (productId: string) => boolean;
  removeProduct: (productId: string) => void;
  isSelected: (productId: string) => boolean;
  updateSpecifications: (productId: string, specs: Partial<ProductSpecifications>) => void;
  updateCustomerDetails: (details: Partial<CustomerDetails>) => void;
  clearEnquiry: () => void;
  selectedCount: number;
}

const STORAGE_KEY = 'packform-enquiry';
const knownProducts = new Set(products.map((product) => product.id));
const plyOptions = new Set<PlyPreference>(['3-ply', '5-ply', '7-ply', 'not-sure']);
const printingOptions = new Set<PrintingPreference>(['no-printing', 'printing-required', 'not-sure']);

const defaultEnquiry: EnquiryState = {
  selectedProductIds: [],
  specifications: {},
  customerDetails: {},
};

const defaultSpecs = (productId: string): ProductSpecifications => ({
  productId,
  quantity: 100,
  length: '',
  width: '',
  height: '',
  plyPreference: 'not-sure',
  printing: 'not-sure',
  whatWillBePacked: '',
  additionalRequirements: '',
});

const safeDimension = (value: unknown): string => {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  const input = String(value).trim();
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(input)) return '';
  const number = Number(input);
  return number > 0 && number <= 10000 ? input : '';
};

/**
 * Only store non-sensitive technical selections between page reloads.
 * Contact information and free-text notes stay in React memory, and disappear
 * when the page is reloaded or the user clears the demo.
 */
function safeStoredEnquiry(value: unknown): Pick<EnquiryState, 'selectedProductIds' | 'specifications'> {
  const candidate = value && typeof value === 'object' ? value as Partial<EnquiryState> : {};
  const selectedProductIds = Array.isArray(candidate.selectedProductIds)
    ? [...new Set(candidate.selectedProductIds.filter((id): id is string =>
        typeof id === 'string' && knownProducts.has(id)
      ))]
    : [];

  const oldSpecs = candidate.specifications && typeof candidate.specifications === 'object'
    ? candidate.specifications
    : {};
  const specifications: Record<string, ProductSpecifications> = {};
  selectedProductIds.forEach((productId) => {
    const previous = oldSpecs[productId] ?? defaultSpecs(productId);
    specifications[productId] = {
      ...defaultSpecs(productId),
      quantity: safeQuantity(previous.quantity),
      length: safeDimension(previous.length),
      width: safeDimension(previous.width),
      height: safeDimension(previous.height),
      plyPreference: plyOptions.has(previous.plyPreference) ? previous.plyPreference : 'not-sure',
      printing: printingOptions.has(previous.printing) ? previous.printing : 'not-sure',
    };
  });
  return { selectedProductIds, specifications };
}

function loadEnquiry(): EnquiryState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultEnquiry;
    const saved = safeStoredEnquiry(JSON.parse(stored));
    // Immediately scrub legacy saved contact details rather than waiting for
    // an effect or sending them to the application.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return { ...saved, customerDetails: {} };
  } catch {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ }
    return defaultEnquiry;
  }
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [enquiry, setEnquiry] = useState<EnquiryState>(loadEnquiry);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeStoredEnquiry(enquiry)));
    } catch { /* Private browsing can disable localStorage. The demo still works in memory. */ }
  }, [enquiry]);

  const addProduct = useCallback(
    (productId: string): boolean => {
      if (!knownProducts.has(productId) || enquiry.selectedProductIds.includes(productId)) return false;
      setEnquiry((previous) => {
        if (previous.selectedProductIds.includes(productId)) return previous;
        return {
          ...previous,
          selectedProductIds: [...previous.selectedProductIds, productId],
          specifications: {
            ...previous.specifications,
            [productId]: defaultSpecs(productId),
          },
        };
      });
      return true;
    },
    [enquiry.selectedProductIds]
  );

  const removeProduct = useCallback((productId: string) => {
    setEnquiry((previous) => {
      const specifications = { ...previous.specifications };
      delete specifications[productId];
      return {
        ...previous,
        selectedProductIds: previous.selectedProductIds.filter((id) => id !== productId),
        specifications,
      };
    });
  }, []);

  const isSelected = useCallback(
    (productId: string) => enquiry.selectedProductIds.includes(productId),
    [enquiry.selectedProductIds]
  );

  const updateSpecifications = useCallback((productId: string, specs: Partial<ProductSpecifications>) => {
    if (!knownProducts.has(productId)) return;
    setEnquiry((previous) => ({
      ...previous,
      specifications: {
        ...previous.specifications,
        [productId]: {
          ...(previous.specifications[productId] ?? defaultSpecs(productId)),
          ...specs,
        },
      },
    }));
  }, []);

  const updateCustomerDetails = useCallback((details: Partial<CustomerDetails>) => {
    setEnquiry((previous) => ({
      ...previous,
      customerDetails: { ...previous.customerDetails, ...details },
    }));
  }, []);

  const clearEnquiry = useCallback(() => {
    setEnquiry({ selectedProductIds: [], specifications: {}, customerDetails: {} });
  }, []);

  return (
    <EnquiryContext.Provider value={{
      enquiry,
      addProduct,
      removeProduct,
      isSelected,
      updateSpecifications,
      updateCustomerDetails,
      clearEnquiry,
      selectedCount: enquiry.selectedProductIds.length,
    }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used within EnquiryProvider');
  return ctx;
}
