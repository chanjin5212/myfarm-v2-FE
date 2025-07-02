import apiClient from '../api-client';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  ApiResponse,
} from '@/types/api';

/**
 * 장바구니 관련 API 서비스
 */
export const cartService = {
  /**
   * 장바구니 조회
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  /**
   * 장바구니에 상품 추가
   */
  addToCart: async (item: AddToCartRequest): Promise<CartItem> => {
    const response = await apiClient.post<ApiResponse<CartItem>>('/cart/items', item);
    return response.data.data;
  },

  /**
   * 장바구니 상품 수량 업데이트
   */
  updateCartItem: async (itemId: number, quantity: number): Promise<CartItem> => {
    const response = await apiClient.put<ApiResponse<CartItem>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data.data;
  },

  /**
   * 장바구니 상품 삭제
   */
  removeFromCart: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`);
  },

  /**
   * 장바구니 전체 비우기
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },

  /**
   * 선택한 상품들 삭제
   */
  removeSelectedItems: async (itemIds: number[]): Promise<void> => {
    await apiClient.delete('/cart/items', {
      data: { itemIds },
    });
  },

  /**
   * 장바구니 아이템 개수 조회
   */
  getCartItemCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/cart/count');
    return response.data.data.count;
  },
}; 