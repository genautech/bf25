export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  vendor: string;
  price: number;
  description: string;
  imageUrl: string;
  purchaseLink?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
