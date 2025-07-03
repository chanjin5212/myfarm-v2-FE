import apiClient from '../api-client';
import {
  CheckDuplicateRequest,
  CheckDuplicateResponse,
  DuplicateCheckType,
  SendVerificationRequest,
  SendVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/types/api';

/**
 * 검증 관련 API 서비스
 */
export const validationService = {
  /**
   * 중복 확인 (범용)
   */
  checkDuplicate: async (type: string, value: string): Promise<CheckDuplicateResponse> => {
    const request: CheckDuplicateRequest = { type, value };
    const response = await apiClient.post<CheckDuplicateResponse>('/users/v1/check-duplicate', request);
    return response.data;
  },

  /**
   * 로그인 ID 중복 확인
   */
  checkLoginIdDuplicate: async (loginId: string): Promise<CheckDuplicateResponse> => {
    return validationService.checkDuplicate('login_id', loginId);
  },

  /**
   * 이메일 중복 확인
   */
  checkEmailDuplicate: async (email: string): Promise<CheckDuplicateResponse> => {
    return validationService.checkDuplicate('email', email);
  },

  /**
   * 전화번호 중복 확인
   */
  checkPhoneDuplicate: async (phone: string): Promise<CheckDuplicateResponse> => {
    return validationService.checkDuplicate('phone', phone);
  },

  /**
   * 이메일 인증 코드 발송
   */
  sendEmailVerificationCode: async (email: string): Promise<SendVerificationResponse> => {
    const request: SendVerificationRequest = { email };
    const response = await apiClient.post<SendVerificationResponse>('/email-verifications/v1/send', request);
    return response.data;
  },

  /**
   * 이메일 인증 코드 확인
   */
  verifyEmailCode: async (email: string, code: string): Promise<VerifyEmailResponse> => {
    const request: VerifyEmailRequest = { email, code };
    const response = await apiClient.post<VerifyEmailResponse>('/email-verifications/v1/verify', request);
    return response.data;
  },
}; 