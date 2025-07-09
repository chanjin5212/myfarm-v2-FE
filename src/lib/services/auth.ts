import apiClient from '../api-client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  User,
  ApiResponse,
  FindIdRequest,
  FindIdResponse,
  FindPasswordRequest,
  FindPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  MeResponse,
} from '@/types/api';

/**
 * 인증 관련 API 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (credentials: LoginRequest): Promise<void> => {
    // 백엔드에서 200 응답만 반환하므로 응답 데이터 없음
    await apiClient.post('/users/v1/login', credentials);
    
    // 세션 기반이므로 토큰 저장 불필요
    // 자동 로그인은 세션으로 처리됨
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
      // 브라우저에서 세션 쿠키 삭제
      if (typeof document !== 'undefined') {
        // 일반적인 세션 쿠키 이름들 삭제
        const cookiesToDelete = ['JSESSIONID', 'sessionId', 'SESSION'];
        cookiesToDelete.forEach(cookieName => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        });
        
        // 모든 쿠키 삭제 (보안상 안전)
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      }
      
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
  getCurrentUser: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/users/v1/me');
    return response.data;
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

  /**
   * 아이디 찾기
   */
  findId: async (email: string): Promise<FindIdResponse> => {
    const request: FindIdRequest = { email };
    const response = await apiClient.post<FindIdResponse>('/users/v1/find-id', request);
    return response.data;
  },

  /**
   * 비밀번호 찾기 가능 여부 확인
   */
  findPassword: async (email: string, loginId: string): Promise<FindPasswordResponse> => {
    const request: FindPasswordRequest = { email, login_id: loginId };
    const response = await apiClient.post<FindPasswordResponse>('/users/v1/find-password', request);
    return response.data;
  },

  /**
   * 새로운 비밀번호 재설정 (이메일 + 로그인 ID 기반)
   */
  resetPasswordWithCredentials: async (email: string, loginId: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const request: ResetPasswordRequest = { email, login_id: loginId, new_password: newPassword };
    const response = await apiClient.post<ResetPasswordResponse>('/users/v1/reset-password', request);
    return response.data;
  },
}; 