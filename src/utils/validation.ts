// 비밀번호 검증 타입
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    length: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    combinationCount: number;
  };
}

/**
 * 비밀번호 유효성 검사
 * 조건: 8자 이상, 대문자/소문자/숫자/특수문자 중 최소 2가지 이상
 */
export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  // 각 조건 검사
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // 조합 개수 계산
  const combinationCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  // 길이 검사
  const hasValidLength = password.length >= 8;
  if (!hasValidLength) {
    errors.push('8자 이상 입력해주세요');
  }
  
  // 조합 검사 (최소 2가지)
  if (combinationCount < 2) {
    errors.push('대문자, 소문자, 숫자, 특수문자 중 최소 2가지를 포함해주세요');
  }
  
  // 전체 유효성
  const isValid = hasValidLength && combinationCount >= 2;
  
  return {
    isValid,
    errors,
    requirements: {
      length: hasValidLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      combinationCount,
    },
  };
};

/**
 * 비밀번호 확인 검증
 */
export const validatePasswordConfirm = (password: string, confirmPassword: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!confirmPassword) {
    return { isValid: false };
  }
  
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: '비밀번호가 일치하지 않습니다',
    };
  }
  
  return { isValid: true };
};

/**
 * 비밀번호 강도 계산 (1-5단계)
 */
export const getPasswordStrength = (password: string): {
  strength: number;
  label: string;
  color: string;
} => {
  const validation = validatePassword(password);
  
  if (!password) {
    return { strength: 0, label: '', color: 'gray' };
  }
  
  if (!validation.requirements.length) {
    return { strength: 1, label: '매우 약함', color: 'red' };
  }
  
  const { combinationCount } = validation.requirements;
  
  if (combinationCount === 1) {
    return { strength: 2, label: '약함', color: 'orange' };
  } else if (combinationCount === 2) {
    return { strength: 3, label: '보통', color: 'yellow' };
  } else if (combinationCount === 3) {
    return { strength: 4, label: '강함', color: 'green' };
  } else {
    return { strength: 5, label: '매우 강함', color: 'blue' };
  }
}; 