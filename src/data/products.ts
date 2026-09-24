import type { Product } from '../types/product';

export const products: Product[] = [
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
    image: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80&auto=format&fit=crop',
    tags: ['self locking', 'mailer', 'no tape', 'fast packing', 'assembly'],
  },
  {
    id: 'retail-display-box',
    name: 'Retail Display Box',
    slug: 'retail-display-box',
    category: 'Retail',
    shortDescription: 'Designed to present products attractively at point of sale.',
    description:
      'A corrugated display box that serves as both shipping container and retail display unit. Folds open to create a shelf-ready display.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop',
    tags: ['retail', 'display', 'point of sale', 'shelf ready', 'presentation'],
  },
  {
    id: 'archive-storage-box',
    name: 'Archive Storage Box',
    slug: 'archive-storage-box',
    category: 'Specialty',
    shortDescription: 'Robust lidded boxes for long-term document and record storage.',
    description:
      'A sturdy corrugated archive box with lid, designed for the secure storage of documents, files and records over extended periods.',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80&auto=format&fit=crop',
    tags: ['archive', 'storage', 'documents', 'records', 'files', 'lidded'],
  },
  {
    id: 'book-shipping-box',
    name: 'Book Shipping Box',
    slug: 'book-shipping-box',
    category: 'Shipping',
    shortDescription: 'Flat corrugated cartons sized for books, documents and flat goods.',
    description:
      'A shallow corrugated box designed for safely shipping books, printed materials and flat products. Reduces movement and protects contents.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80&auto=format&fit=crop',
    tags: ['book', 'flat', 'documents', 'printed materials', 'shallow'],
  },
  {
    id: 'long-product-box',
    name: 'Long Product Box',
    slug: 'long-product-box',
    category: 'Specialty',
    shortDescription: 'Extended-length cartons for pipes, tubes, rods and long items.',
    description:
      'A narrow, elongated corrugated carton designed for packaging long products such as rods, tubes, pipes and extended goods.',
    image: 'https://images.unsplash.com/photo-1416339684178-3a239570f315?w=600&q=80&auto=format&fit=crop',
    tags: ['long', 'tube', 'rod', 'pipe', 'extended', 'elongated'],
  },
  {
    id: 'multi-depth-box',
    name: 'Multi-Depth Box',
    slug: 'multi-depth-box',
    category: 'Custom',
    shortDescription: 'Adjustable depth carton that can be cut to multiple height configurations.',
    description:
      'A corrugated carton with pre-scored lines allowing the height to be adjusted to match the product, minimising wasted space.',
    image: 'https://images.unsplash.com/photo-1595872551046-2b87bf04ba3a?w=600&q=80&auto=format&fit=crop',
    tags: ['multi depth', 'adjustable', 'flexible height', 'reduce void fill'],
  },
  {
    id: 'folding-corrugated-carton',
    name: 'Folding Corrugated Carton',
    slug: 'folding-corrugated-carton',
    category: 'Shipping',
    shortDescription: 'Flat-pack cartons that fold quickly for efficient assembly on the packing line.',
    description:
      'A corrugated carton that is supplied flat-packed and erects quickly with minimal effort. Designed to improve packing line efficiency.',
    image: 'https://images.unsplash.com/photo-1584462473462-8e7e40fb7ff7?w=600&q=80&auto=format&fit=crop',
    tags: ['flat pack', 'folding', 'packing line', 'efficient', 'assembly'],
  },
  {
    id: 'corrugated-divider',
    name: 'Corrugated Divider Set',
    slug: 'corrugated-divider',
    category: 'Dividers & Partitions',
    shortDescription: 'Interlocking dividers that fit inside standard cartons to protect multiple items.',
    description:
      'Corrugated divider sets that slot together to create individual compartments inside a standard carton, protecting multiple items from contact damage.',
    image: 'https://images.unsplash.com/photo-1623461487986-9400108f4d9c?w=600&q=80&auto=format&fit=crop',
    tags: ['divider', 'partition', 'interlocking', 'compartment', 'protection'],
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
