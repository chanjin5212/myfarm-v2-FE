// API 서비스들을 통합하여 export
export { authService } from './auth';
export { productService } from './products';
export { cartService } from './cart';
export { orderService } from './orders';
export { shippingService } from './shipping';
export { validationService } from './validation';

// API 클라이언트와 유틸리티들
export { default as apiClient, sessionUtils } from '../api-client';

// 서비스들 import
import { authService } from './auth';
import { productService } from './products';
import { cartService } from './cart';
import { orderService } from './orders';
import { shippingService } from './shipping';
import { validationService } from './validation';

// 모든 서비스를 하나의 객체로 export (선택적 사용)
export const api = {
  auth: authService,
  products: productService,
  cart: cartService,
  orders: orderService,
  shipping: shippingService,
  validation: validationService,
} as const; 