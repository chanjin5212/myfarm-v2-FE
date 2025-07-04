import apiClient from '../api-client';
import {
  CreateShippingAddressRequest,
  CreateShippingAddressResponse,
  ShippingAddress,
  ShippingAddressInfo,
  ListShippingAddressRequest,
  ListShippingAddressResponse,
  UpdateShippingAddressRequest,
  UpdateShippingAddressResponse,
  DeleteShippingAddressResponse,
  ApiResponse,
} from '@/types';

/**
 * 배송지 관련 API 서비스
 */
export const shippingService = {
  /**
   * 배송지 생성
   */
  createShippingAddress: async (data: CreateShippingAddressRequest): Promise<CreateShippingAddressResponse> => {
    const response = await apiClient.post<ApiResponse<CreateShippingAddressResponse>>('/shipping-addresses/v1', data);
    return response.data.data;
  },

  /**
   * 배송지 목록 조회
   */
  listShippingAddresses: async (params?: ListShippingAddressRequest): Promise<ListShippingAddressResponse> => {
    const response = await apiClient.get<ApiResponse<ListShippingAddressResponse>>('/shipping-addresses/v1', { params });
    return response.data.data;
  },

  /**
   * 배송지 단일 조회
   */
  getShippingAddress: async (id: string): Promise<ShippingAddress> => {
    const response = await apiClient.get<ApiResponse<ShippingAddress>>(`/shipping-addresses/v1/${id}`);
    return response.data.data;
  },

  /**
   * 배송지 수정
   */
  updateShippingAddress: async (id: string, data: UpdateShippingAddressRequest): Promise<UpdateShippingAddressResponse> => {
    const response = await apiClient.put<ApiResponse<UpdateShippingAddressResponse>>(`/shipping-addresses/v1/${id}`, data);
    return response.data.data;
  },

  /**
   * 배송지 삭제
   */
  deleteShippingAddress: async (id: string): Promise<DeleteShippingAddressResponse> => {
    const response = await apiClient.delete<ApiResponse<DeleteShippingAddressResponse>>(`/shipping-addresses/v1/${id}`);
    return response.data.data;
  },
}; 