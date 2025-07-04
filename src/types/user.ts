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
  email: string;
  login_id: string;
  password: string;
  name: string;
  nickname?: string;
  phone_number?: string;
  postcode?: string;
  address?: string;
  detail_address?: string;
  terms_agreed: boolean;
  marketing_agreed: boolean;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface RegisterResponse {
  email: string;
  login_id: string;
} 