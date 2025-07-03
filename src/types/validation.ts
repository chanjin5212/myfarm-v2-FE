// 중복확인 API 타입
export interface CheckDuplicateRequest {
  type: string;
  value: string;
}

export interface CheckDuplicateResponse {
  available: boolean;
  message: string;
}

// 중복확인 타입 열거형
export type DuplicateCheckType = 'loginId' | 'email' | 'phone';

// 이메일 인증 API 타입
export interface SendVerificationRequest {
  email: string;
}

export interface SendVerificationResponse {
  email: string;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  email: string;
  verified: boolean;
  message: string;
} 