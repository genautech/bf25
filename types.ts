export interface Product {
  id: string; // SKU
  name: string;
  category: string;
  subcategory: string;
  supplier: string;
  price: number;
  purchaseUrl: string;
  imageUrl?: string;
  description?: string;
  margin?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
