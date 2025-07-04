import apiClient from '../api-client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  User,
  ApiResponse,
} from '@/types/api';

/**
 * 인증 관련 API 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/users/v1/login', credentials);
    
    // 세션 기반이므로 토큰 저장 불필요
    // 자동 로그인은 세션으로 처리됨
    
    return response.data.data;
  },

  /**
   * 회원가입
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/users/v1/register', userData);
    
    return response.data.data;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/users/v1/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 세션 만료 후 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  /**
   * 세션 확인 (토큰 갱신 대신)
   */
  checkSession: async (): Promise<boolean> => {
    try {
      await apiClient.get('/users/v1/session');
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/v1/me');
    return response.data.data;
  },

  /**
   * 사용자 정보 업데이트
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/v1/profile', userData);
    return response.data.data;
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await apiClient.put('/users/v1/change-password', passwords);
  },

  /**
   * 비밀번호 재설정 요청
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/users/v1/forgot-password', { email });
  },

  /**
   * 비밀번호 재설정
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/users/v1/reset-password', { token, newPassword });
  },
}; 