// 사용자 관련 타입
export interface User {
  id: number;
  loginId: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    zipCode: string;
    street: string;
    detail: string;
  };
  createdAt: string;
  updatedAt: string;
}

// 인증 관련 타입
export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface RegisterRequest {
  loginId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  detailAddress?: string;
  postalCode?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
} 