export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK';

export interface Product {
  id: number;
  name: string;
  brandName: string;
  description: string;
  price: number;
  images: string[];
  status: ProductStatus;
}
