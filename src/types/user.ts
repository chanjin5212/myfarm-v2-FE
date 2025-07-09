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
  login_id: string;
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

// 아이디 찾기 API 타입
export interface FindIdRequest {
  email: string;
}

export interface FindIdResponse {
  login_id: string;
}

// 비밀번호 찾기 API 타입
export interface FindPasswordRequest {
  email: string;
  login_id: string;
}

export interface FindPasswordResponse {
  available: boolean;
}

// 비밀번호 재설정 API 타입
export interface ResetPasswordRequest {
  email: string;
  login_id: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// 현재 사용자 정보 조회 API 타입
export interface MeResponse {
  id: string; // UUID
  email: string;
  login_id: string;
  name: string;
  nickname?: string;
  phone_number: string;
  postcode?: string;
  address?: string;
  detail_address?: string;
  avatar_url?: string;
  terms_agreed: boolean;
  marketing_agreed: boolean;
  created_at: string; // ISO string
  last_login?: string; // ISO string
} 