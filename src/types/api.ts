// 공통 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 관련 타입
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

// 상품 관련 타입
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  isActive: boolean;
  badge?: string;
  weight?: string;
  origin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  address?: {
    zipCode: string;
    street: string;
    detail: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

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

// 주문 관련 타입
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

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
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

// 에러 타입
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 