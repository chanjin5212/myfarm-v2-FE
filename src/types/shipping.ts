// 배송지 관련 타입 정의

export interface CreateShippingAddressRequest {
  recipient_name: string;
  phone: string;
  address: string;
  detail_address?: string;
  is_default: boolean;
  memo?: string;
}

export interface CreateShippingAddressResponse {
  success: boolean;
  message?: string;
}

export interface ShippingAddressInfo {
  id: string;
  recipient_name: string;
  phone: string;
  address: string;
  detail_address?: string;
  is_default: boolean;
  memo?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  address: string;
  detail_address?: string;
  is_default: boolean;
  memo?: string;
  created_at: string;
  updated_at: string;
}

export interface ListShippingAddressRequest {
  page?: number;
  size?: number;
}

export interface ListShippingAddressResponse {
  total_count: number;
  address: ShippingAddressInfo[];
}

export interface UpdateShippingAddressRequest {
  recipient_name: string;
  phone: string;
  address: string;
  detail_address?: string;
  is_default: boolean;
  memo?: string;
}

export interface UpdateShippingAddressResponse {
  success: boolean;
  message?: string;
}

export interface DeleteShippingAddressResponse {
  success: boolean;
  message?: string;
} 