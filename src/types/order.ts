import { Product } from './product';

// 주문 관련 타입
export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    zipCode: string;
    street: string;
    detail: string;
  };
  paymentMethod: 'card' | 'bank' | 'kakao';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: {
    recipientName: string;
    phone: string;
    zipCode: string;
    street: string;
    detail: string;
  };
  paymentMethod: 'card' | 'bank' | 'kakao';
} 