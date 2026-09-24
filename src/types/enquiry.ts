export type PlyPreference = '3-ply' | '5-ply' | '7-ply' | 'not-sure';
export type PrintingPreference = 'no-printing' | 'printing-required' | 'not-sure';

export interface ProductSpecifications {
  productId: string;
  quantity: number;
  length?: string;
  width?: string;
  height?: string;
  plyPreference: PlyPreference;
  printing: PrintingPreference;
  whatWillBePacked?: string;
  additionalRequirements?: string;
}

export interface CustomerDetails {
  contactName: string;
  companyName: string;
  email?: string;
  phone?: string;
  deliveryCity?: string;
}

export interface SelectedProduct {
  productId: string;
  specifications: ProductSpecifications;
}

export interface EnquiryState {
  selectedProductIds: string[];
  specifications: Record<string, ProductSpecifications>;
  customerDetails: Partial<CustomerDetails>;
}
