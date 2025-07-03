import { Product } from './product';

// 장바구니 관련 타입
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
} 