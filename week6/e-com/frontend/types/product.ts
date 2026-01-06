export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  stock: string;
  regularPrice: string;
  salePrice: string;
  tags: string[];
  isOnSale: boolean;
  type: 'regular' | 'loyalty_only' | 'hybrid';
  pointsPrice: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  category?: string;
  brand?: string;
  sku?: string;
  tags?: string[];
  isOnSale?: boolean;
  createdAt: string;
  updatedAt: string;
}
