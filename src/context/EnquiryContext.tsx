import { createContext, useContext, useCallback, useEffect } from 'react';
import { products } from '../data/products';
import type { ReactNode } from 'react';
import type { EnquiryState, ProductSpecifications, CustomerDetails, PlyPreference, PrintingPreference } from '../types/enquiry';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  plyPreference: 'not-sure' as PlyPreference,
  printing: 'not-sure' as PrintingPreference,
  whatWillBePacked: '',
  additionalRequirements: '',
});

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [enquiry, setEnquiry] = useLocalStorage<EnquiryState>('packform-enquiry', defaultEnquiry);

  // A visitor may still have saved items from the former 22-item sample
  // catalogue. Drop removed product IDs so the 15-product demo never shows
  // ghost selections or misleading basket counts.
  useEffect(() => {
    const supported = new Set(products.map((product) => product.id));
    setEnquiry((previous) => {
      const ids = [...new Set(previous.selectedProductIds.filter((id) => supported.has(id)))];
      if (ids.length === previous.selectedProductIds.length) return previous;
      const specifications = Object.fromEntries(
        ids.filter((id) => previous.specifications[id])
          .map((id) => [id, previous.specifications[id]])
      );
      return { ...previous, selectedProductIds: ids, specifications };
    });
    // This is a one-time migration for previously saved demo values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const addProduct = useCallback(
    (productId: string): boolean => {
      if (enquiry.selectedProductIds.includes(productId)) return false;
      setEnquiry((prev) => ({
        ...prev,
        selectedProductIds: [...prev.selectedProductIds, productId],
        specifications: {
          ...prev.specifications,
          [productId]: defaultSpecs(productId),
        },
      }));
      return true;
    },
    [enquiry.selectedProductIds, setEnquiry]
  );

  const removeProduct = useCallback(
    (productId: string) => {
      setEnquiry((prev) => {
        const specs = { ...prev.specifications };
        delete specs[productId];
        return {
          ...prev,
          selectedProductIds: prev.selectedProductIds.filter((id) => id !== productId),
          specifications: specs,
        };
      });
    },
    [setEnquiry]
  );

  const isSelected = useCallback(
    (productId: string) => enquiry.selectedProductIds.includes(productId),
    [enquiry.selectedProductIds]
  );

  const updateSpecifications = useCallback(
    (productId: string, specs: Partial<ProductSpecifications>) => {
      setEnquiry((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [productId]: {
            ...(prev.specifications[productId] ?? defaultSpecs(productId)),
            ...specs,
          },
        },
      }));
    },
    [setEnquiry]
  );

  const updateCustomerDetails = useCallback(
    (details: Partial<CustomerDetails>) => {
      setEnquiry((prev) => ({
        ...prev,
        customerDetails: { ...prev.customerDetails, ...details },
      }));
    },
    [setEnquiry]
  );

  const clearEnquiry = useCallback(() => {
    setEnquiry(defaultEnquiry);
  }, [setEnquiry]);

  const selectedCount = enquiry.selectedProductIds.length;

  return (
    <EnquiryContext.Provider
      value={{
        enquiry,
        addProduct,
        removeProduct,
        isSelected,
        updateSpecifications,
        updateCustomerDetails,
        clearEnquiry,
        selectedCount,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used within EnquiryProvider');
  return ctx;
}
