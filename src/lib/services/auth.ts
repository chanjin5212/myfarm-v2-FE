import apiClient, { tokenUtils } from '../api-client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
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
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    // 토큰 저장
    const { accessToken, refreshToken } = response.data.data;
    tokenUtils.setTokens(accessToken, refreshToken);
    
    return response.data.data;
  },

  /**
   * 회원가입
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    
    // 자동 로그인
    const { accessToken, refreshToken } = response.data.data;
    tokenUtils.setTokens(accessToken, refreshToken);
    
    return response.data.data;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // 로그아웃 실패해도 토큰은 삭제
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      tokenUtils.clearTokens();
    }
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken,
    });

    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);

    return response.data.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  /**
   * 사용자 정보 업데이트
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', userData);
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
    await apiClient.put('/auth/change-password', passwords);
  },

  /**
   * 비밀번호 재설정 요청
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * 비밀번호 재설정
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },

  /**
   * 이메일 인증 코드 발송
   */
  sendEmailVerification: async (email: string): Promise<void> => {
    await apiClient.post('/auth/send-verification', { email });
  },

  /**
   * 이메일 인증
   */
  verifyEmail: async (email: string, code: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { email, code });
  },
}; 