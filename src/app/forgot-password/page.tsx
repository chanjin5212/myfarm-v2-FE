'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { validationService } from '@/lib/services/validation';
import { authService } from '@/lib/services/auth';
import { VerificationType } from '@/types/api';
import { validatePassword, validatePasswordConfirm, getPasswordStrength } from '@/utils/validation';

export default function ForgotPasswordPage() {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    loginId: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [emailCode, setEmailCode] = useState('');
  const [step, setStep] = useState<'credentials' | 'verification' | 'newPassword' | 'result'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [passwordConfirmValidation, setPasswordConfirmValidation] = useState(validatePasswordConfirm('', ''));
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // 비밀번호가 변경되면 검증 실행
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      const strength = getPasswordStrength(value);
      const confirmValidation = validatePasswordConfirm(value, newFormData.confirmPassword);
      
      setPasswordValidation(validation);
      setPasswordStrength(strength);
      setPasswordConfirmValidation(confirmValidation);
    }
    
    // 비밀번호 확인이 변경되면 일치 여부 검증
    if (name === 'confirmPassword') {
      const confirmValidation = validatePasswordConfirm(formData.newPassword, value);
      setPasswordConfirmValidation(confirmValidation);
    }
    
    setFormData(newFormData);
  };

  const handleCheckCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.loginId) {
      showError('이메일과 로그인 ID를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.findPassword(formData.email, formData.loginId);
      
      if (response.available) {
        // 비밀번호 찾기 가능한 경우 이메일 인증 코드 발송
        setEmailSending(true);
        
        try {
          const emailResponse = await validationService.sendEmailVerificationCode(formData.email, VerificationType.FIND_PASSWORD);
          setStep('verification');
          success(emailResponse.message);
        } catch (emailError) {
          console.error('이메일 인증 코드 발송 에러:', emailError);
          showError('인증 코드 발송에 실패했습니다.');
        } finally {
          setEmailSending(false);
        }
      } else {
        showError('입력하신 이메일과 로그인 ID가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 찾기 확인 에러:', error);
      showError('비밀번호 찾기 확인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailCode) {
      showError('인증 코드를 입력해주세요.');
      return;
    }

    setEmailVerifying(true);
    
    try {
      const verifyResponse = await validationService.verifyEmailCode(formData.email, emailCode);
      
      if (verifyResponse.verified) {
        setStep('newPassword');
        success('인증이 완료되었습니다. 새 비밀번호를 설정해주세요.');
      } else {
        showError('인증에 실패했습니다. 인증 코드를 확인해주세요.');
      }
    } catch (error) {
      console.error('이메일 인증 에러:', error);
      showError('인증 코드가 일치하지 않습니다.');
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      showError('비밀번호 조건을 확인해주세요.');
      return;
    }

    if (!passwordConfirmValidation.isValid) {
      showError('비밀번호 확인을 확인해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.resetPasswordWithCredentials(
        formData.email,
        formData.loginId,
        formData.newPassword
      );
      
      if (response.success) {
        setStep('result');
        success(response.message);
      } else {
        showError('비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 재설정 에러:', error);
      showError('비밀번호 재설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setFormData({
      email: '',
      loginId: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEmailCode('');
    setStep('credentials');
    setPasswordValidation(validatePassword(''));
    setPasswordConfirmValidation(validatePasswordConfirm('', ''));
    setPasswordStrength(getPasswordStrength(''));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            비밀번호 찾기
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이메일 인증을 통해 비밀번호를 재설정해드립니다.
          </p>
        </div>

        <Card className="p-8">
          {step === 'credentials' && (
            <form className="space-y-6" onSubmit={handleCheckCredentials}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일 주소
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
                  로그인 ID
                </label>
                <Input
                  id="loginId"
                  name="loginId"
                  type="text"
                  required
                  value={formData.loginId}
                  onChange={handleChange}
                  placeholder="로그인 ID를 입력하세요"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || emailSending}
                className="w-full flex justify-center py-2 px-4"
              >
                {isLoading ? '확인 중...' : emailSending ? '인증 코드 발송 중...' : '다음'}
              </Button>
            </form>
          )}

          {step === 'verification' && (
            <form className="space-y-6" onSubmit={handleVerifyEmail}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일 주소
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="mt-1"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="emailCode" className="block text-sm font-medium text-gray-700">
                  인증 코드
                </label>
                <Input
                  id="emailCode"
                  name="emailCode"
                  type="text"
                  required
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="인증 코드를 입력하세요"
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartOver}
                  className="flex-1"
                >
                  다시 시도
                </Button>
                <Button
                  type="submit"
                  disabled={emailVerifying}
                  className="flex-1"
                >
                  {emailVerifying ? '인증 중...' : '인증 확인'}
                </Button>
              </div>
            </form>
          )}

          {step === 'newPassword' && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="8자 이상, 영문/숫자/특수문자 중 2가지 이상"
                  className="mt-1"
                />
                
                {/* 비밀번호 강도 */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">비밀번호 강도</span>
                      <span className={`text-sm font-medium ${
                        passwordStrength.color === 'red' ? 'text-red-600' :
                        passwordStrength.color === 'orange' ? 'text-orange-600' :
                        passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                        passwordStrength.color === 'green' ? 'text-green-600' :
                        passwordStrength.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.color === 'red' ? 'bg-red-500' :
                          passwordStrength.color === 'orange' ? 'bg-orange-500' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                          passwordStrength.color === 'green' ? 'bg-green-500' :
                          passwordStrength.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* 비밀번호 조건 */}
                {formData.newPassword && passwordValidation.errors.length > 0 && (
                  <div className="mt-2">
                    {passwordValidation.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">• {error}</p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  새 비밀번호 확인
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="mt-1"
                />
                
                {/* 비밀번호 일치 확인 */}
                {formData.confirmPassword && (
                  <div className="mt-1">
                    {passwordConfirmValidation.isValid ? (
                      <p className="text-sm text-green-600 flex items-center">
                        <span className="mr-1">✓</span>
                        비밀번호가 일치합니다
                      </p>
                    ) : passwordConfirmValidation.error ? (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">✗</span>
                        {passwordConfirmValidation.error}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartOver}
                  className="flex-1"
                >
                  다시 시도
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !passwordValidation.isValid || !passwordConfirmValidation.isValid}
                  className="flex-1"
                >
                  {isLoading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </div>
            </form>
          )}

          {step === 'result' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  비밀번호가 성공적으로 변경되었습니다!
                </h3>
                <p className="text-sm text-gray-600">
                  새로운 비밀번호로 로그인해주세요.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartOver}
                  className="flex-1"
                >
                  다른 계정
                </Button>
                <Link href="/login" className="flex-1">
                  <Button className="w-full">
                    로그인하기
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-gray-900 hover:text-gray-700 underline text-sm"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 