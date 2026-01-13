export type ProductOption = {
  name: string;
  values: string[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  isAvailableForSale: boolean;
  image?: Image;
  href: string;
  selectedOptions: SelectedOption[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceRange: {
    minVariantPrice: number;
    maxVariantPrice: number;
  };
  isAvailableForSale: boolean;
  featuredImage?: Image;
  createdAt: Date;
  updatedAt: Date;
  
  options: string[];
  optionsWithValues: ProductOption[];
  variants: ProductVariant[];
};

export type Image = {
  url: string | null;
  altText?: string | null;
  width?: number;
  height?: number;
};