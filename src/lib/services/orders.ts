import apiClient from '../api-client';
import {
  Order,
  CreateOrderRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

/**
 * 주문 관련 API 서비스
 */
export const orderService = {
  /**
   * 주문 생성
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  /**
   * 주문 목록 조회 (사용자별)
   */
  getOrders: async (
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<PaginatedResponse<Order[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await apiClient.get<PaginatedResponse<Order[]>>(`/orders?${params}`);
    return response.data;
  },

  /**
   * 주문 상세 조회
   */
  getOrder: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  },

  /**
   * 주문 번호로 조회
   */
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/number/${orderNumber}`);
    return response.data.data;
  },

  /**
   * 주문 취소
   */
  cancelOrder: async (orderId: number, reason?: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * 주문 상태 업데이트 (관리자용)
   */
  updateOrderStatus: async (
    orderId: number,
    status: string,
    message?: string
  ): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, {
      status,
      message,
    });
    return response.data.data;
  },

  /**
   * 배송 정보 조회
   */
  getShippingInfo: async (orderId: number): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/orders/${orderId}/shipping`);
    return response.data.data;
  },

  /**
   * 주문 결제 확인
   */
  confirmPayment: async (orderId: number, paymentData: any): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/payment/confirm`,
      paymentData
    );
    return response.data.data;
  },

  /**
   * 환불 요청
   */
  requestRefund: async (
    orderId: number,
    refundData: {
      reason: string;
      amount?: number;
      items?: number[];
    }
  ): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/orders/${orderId}/refund`,
      refundData
    );
    return response.data.data;
  },

  /**
   * 주문 통계 조회 (관리자용)
   */
  getOrderStats: async (period?: string): Promise<any> => {
    const params = period ? `?period=${period}` : '';
    const response = await apiClient.get<ApiResponse<any>>(`/orders/stats${params}`);
    return response.data.data;
  },
}; 