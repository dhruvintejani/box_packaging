import type { Product } from '../types/product';

// Fifteen curated sample products. All imagery is served from our local box-photo library.\n// Images for specialty variants are representative, not exact manufacturing specifications.\nexport const products: Product[] = [
  {
    id: 'standard-shipping-carton',
    name: 'Standard Shipping Carton',
    slug: 'standard-shipping-carton',
    category: 'Shipping',
    shortDescription: 'Reliable, versatile and cost-effective boxes for everyday shipping needs.',
    description:
      'A practical corrugated carton for general shipping and packaging requirements. Suitable for a wide range of products and industries.',
    image: '/images/product-shipping-carton.jpg',
    tags: ['shipping', 'carton', 'standard', 'general', 'versatile'],
    featured: true,
  },
  {
    id: 'printed-corrugated-carton',
    name: 'Printed Corrugated Carton',
    slug: 'printed-corrugated-carton',
    category: 'Retail',
    shortDescription: 'High-quality printed boxes to showcase your brand.',
    description:
      'Custom printed corrugated cartons that help your packaging represent your brand. Available with single or multi-colour print options.',
    image: '/images/product-printed-carton.jpg',
    tags: ['printed', 'branding', 'custom print', 'retail', 'corrugated'],
    featured: true,
  },
  {
    id: 'mailer-box',
    name: 'Mailer Box',
    slug: 'mailer-box',
    category: 'Mailers',
    shortDescription: 'Perfect for e-commerce, subscription boxes and direct-to-customer shipping.',
    description:
      'A foldable mailer-style box designed for compact product packaging and dispatch. Ideal for e-commerce fulfilment and subscription packaging.',
    image: '/images/product-mailer-box.jpg',
    tags: ['mailer', 'ecommerce', 'subscription', 'direct', 'foldable'],
    featured: true,
  },
  {
    id: 'heavy-duty-carton',
    name: 'Heavy-Duty Carton',
    slug: 'heavy-duty-carton',
    category: 'Heavy Duty',
    shortDescription: 'Built for extra strength and protection for heavy and industrial products.',
    description:
      'A reinforced corrugated carton designed for heavier goods and industrial applications. Provides additional rigidity and structural integrity during transit.',
    image: '/images/product-heavy-duty.jpg',
    tags: ['heavy duty', 'industrial', 'strong', 'reinforced', 'protection'],
    featured: true,
  },
  {
    id: 'partition-box',
    name: 'Partition Box',
    slug: 'partition-box',
    category: 'Dividers & Partitions',
    shortDescription: 'Keep your products organised and protected during transit.',
    description:
      'A corrugated box with internal dividers to separate and protect individual items during shipping and storage.',
    image: '/images/product-partition-box.jpg',
    tags: ['partition', 'divider', 'compartment', 'organise', 'protect'],
    featured: true,
  },
  {
    id: 'custom-size-box',
    name: 'Custom-Size Box',
    slug: 'custom-size-box',
    category: 'Custom',
    shortDescription: 'Tailored to your exact requirements. Any size. Any application.',
    description:
      'A flexible option for packaging requirements where standard box dimensions are not suitable. Specify your own dimensions and requirements.',
    image: '/images/product-custom-box.jpg',
    tags: ['custom', 'bespoke', 'any size', 'flexible', 'tailored'],
    featured: true,
  },
  {
    id: 'die-cut-corrugated-box',
    name: 'Die-Cut Corrugated Box',
    slug: 'die-cut-corrugated-box',
    category: 'Custom',
    shortDescription: 'Precisely cut boxes for a perfect product fit with a professional finish.',
    description:
      'Die-cut corrugated boxes are custom shaped to match the precise dimensions of your product, reducing movement and improving presentation.',
    image: '/images/product-custom-box.jpg',
    tags: ['die cut', 'custom shape', 'precision', 'corrugated'],
  },
  {
    id: 'regular-slotted-carton',
    name: 'Regular Slotted Carton',
    slug: 'regular-slotted-carton',
    category: 'Shipping',
    shortDescription: 'The most widely used corrugated box style for general packaging.',
    description:
      'A regular slotted carton (RSC) with flaps that meet at the centre when folded. Widely used across industries for general shipping.',
    image: '/images/product-shipping-carton.jpg',
    tags: ['slotted', 'rsc', 'standard', 'shipping', 'general'],
  },
  {
    id: 'full-overlap-carton',
    name: 'Full Overlap Carton',
    slug: 'full-overlap-carton',
    category: 'Heavy Duty',
    shortDescription: 'Extra panel coverage for added base and top strength.',
    description:
      'A full overlap slotted carton where all flaps overlap, providing increased stacking strength and protection for heavier or awkward loads.',
    image: '/images/product-heavy-duty.jpg',
    tags: ['full overlap', 'strong', 'stacking', 'heavy', 'protection'],
  },
  {
    id: 'half-slotted-carton',
    name: 'Half Slotted Carton',
    slug: 'half-slotted-carton',
    category: 'Specialty',
    shortDescription: 'Open-top carton suitable for display, packing lines and storage.',
    description:
      'A half slotted carton with flaps on one side only, leaving one end open. Useful for display purposes or packing line applications.',
    image: '/images/product-custom-box.jpg',
    tags: ['half slotted', 'open top', 'display', 'packing', 'storage'],
  },
  {
    id: 'corrugated-tray',
    name: 'Corrugated Tray',
    slug: 'corrugated-tray',
    category: 'Retail',
    shortDescription: 'Low-profile tray packaging for retail display and product presentation.',
    description:
      'A shallow corrugated tray designed for retail display, fresh produce, or product grouping. Easy to stack and handle.',
    image: '/images/product-partition-box.jpg',
    tags: ['tray', 'retail', 'display', 'shallow', 'produce'],
  },
  {
    id: 'corrugated-sleeve',
    name: 'Corrugated Sleeve',
    slug: 'corrugated-sleeve',
    category: 'Specialty',
    shortDescription: 'A protective sleeve that wraps around products for added security.',
    description:
      'A corrugated sleeve that slides over a product or inner packaging, providing an additional layer of protection and a surface for branding.',
    image: '/images/product-custom-box.jpg',
    tags: ['sleeve', 'wrap', 'protective', 'branding', 'outer'],
  },
  {
    id: 'bottle-partition-box',
    name: 'Bottle Partition Box',
    slug: 'bottle-partition-box',
    category: 'Dividers & Partitions',
    shortDescription: 'Specially designed dividers to safely transport bottles and glassware.',
    description:
      'A corrugated box with internal cell dividers designed to protect bottles and fragile cylindrical products during transit and storage.',
    image: '/images/product-partition-box.jpg',
    tags: ['bottle', 'partition', 'glassware', 'fragile', 'divider'],
  },
  {
    id: 'ecommerce-shipping-box',
    name: 'E-Commerce Shipping Box',
    slug: 'ecommerce-shipping-box',
    category: 'Mailers',
    shortDescription: 'Optimised for online retail fulfilment and courier delivery.',
    description:
      'A corrugated shipping box designed specifically for e-commerce applications, with a clean exterior suitable for courier handling and customer unboxing.',
    image: '/images/product-mailer-box.jpg',
    tags: ['ecommerce', 'online retail', 'courier', 'fulfilment', 'shipping'],
  },
  {
    id: 'self-locking-mailer',
    name: 'Self-Locking Mailer',
    slug: 'self-locking-mailer',
    category: 'Mailers',
    shortDescription: 'Easy to assemble without tape or glue for fast packing.',
    description:
      'A self-locking mailer box that assembles quickly without adhesive. Ideal for high-volume dispatch operations.',
    image: '/images/product-mailer-box.jpg',
    tags: ['self locking', 'mailer', 'no tape', 'fast packing', 'assembly'],
  },

];

export const productCategories: string[] = [
  'All',
  'Shipping',
  'Mailers',
  'Heavy Duty',
  'Custom',
  'Retail',
  'Dividers & Partitions',
  'Specialty',
];

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
