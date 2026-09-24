export type ProductCategory =
  | 'Shipping'
  | 'Mailers'
  | 'Heavy Duty'
  | 'Custom'
  | 'Retail'
  | 'Dividers & Partitions'
  | 'Specialty';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  image: string;
  tags: string[];
  featured?: boolean;
}
