import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api';

// 타입 확장: _retry 속성 추가
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRedirect?: boolean; // 인증 실패 시 리다이렉트를 건너뛸지 여부
}

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// 요청 인터셉터 - 세션 기반이므로 토큰 추가 불필요
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('❌ API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 (세션 기반)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    // 401 에러 처리 - 세션 만료 시 로그인 페이지로 리다이렉트
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // skipAuthRedirect 옵션이 true인 경우 리다이렉트하지 않음
      if (!originalRequest.skipAuthRedirect) {
        // 현재 페이지가 로그인 관련 페이지가 아닐 때만 리다이렉트
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const authPages = ['/login', '/register', '/forgot-id', '/forgot-password'];
          
          if (!authPages.includes(currentPath)) {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
    
    // 에러 메시지 표준화
    const errorData = error.response?.data as any;
    const apiError: ApiError = {
      message: errorData?.message || error.message || '알 수 없는 오류가 발생했습니다.',
      code: errorData?.code || error.code,
      status: error.response?.status,
    };
    
    console.error(`❌ API 에러: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`, apiError);
    
    return Promise.reject(apiError);
  }
);

// 세션 관리 유틸리티 함수들
export const sessionUtils = {
  // 로그인 상태 확인 - 서버에 세션 확인 요청
  checkSession: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/users/v1/session');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  // 로그아웃 - 서버에 로그아웃 요청
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/users/v1/logout');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      // 로그아웃 후 로그인 페이지로 리다이렉트 (현재 로그인 페이지가 아닐 때만)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  },
};

export default apiClient; 