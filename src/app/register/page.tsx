'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { validationService } from '@/lib/services/validation';
import { authService } from '@/lib/services/auth';
import { validatePassword, validatePasswordConfirm, getPasswordStrength } from '@/utils/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    postalCode: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [loginIdStatus, setLoginIdStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [loginIdMessage, setLoginIdMessage] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [passwordConfirmValidation, setPasswordConfirmValidation] = useState(validatePasswordConfirm('', ''));
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // 로그인 ID가 변경되면 중복 확인 상태 리셋
    if (name === 'loginId') {
      setLoginIdStatus('idle');
      setLoginIdMessage('');
    }
    
    // 이메일이 변경되면 인증 상태 리셋
    if (name === 'email') {
      setEmailVerified(false);
      setShowEmailVerification(false);
      setEmailCode('');
    }
    
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    
    // 비밀번호가 변경되면 검증 실행
    if (name === 'password') {
      const validation = validatePassword(value);
      const strength = getPasswordStrength(value);
      const confirmValidation = validatePasswordConfirm(value, newFormData.confirmPassword);
      
      setPasswordValidation(validation);
      setPasswordStrength(strength);
      setPasswordConfirmValidation(confirmValidation);
    }
    
    // 비밀번호 확인이 변경되면 일치 여부 검증
    if (name === 'confirmPassword') {
      const confirmValidation = validatePasswordConfirm(formData.password, value);
      setPasswordConfirmValidation(confirmValidation);
    }
    
    setFormData(newFormData);
  };

  const handleLoginIdBlur = async () => {
    if (!formData.loginId) return;
    
    setLoginIdStatus('checking');
    
    try {
      const response = await validationService.checkLoginIdDuplicate(formData.loginId);
      
      setLoginIdMessage(response.message);
      
      if (response.available) {
        setLoginIdStatus('available');
      } else {
        setLoginIdStatus('unavailable');
      }
    } catch (error) {
      console.error('로그인 ID 중복 확인 에러:', error);
      setLoginIdStatus('idle');
      setLoginIdMessage('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSendEmailCode = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setEmailSending(true);
    
    try {
      const response = await validationService.sendEmailVerificationCode(formData.email);
      setShowEmailVerification(true);
      alert(response.message);
    } catch (error) {
      console.error('이메일 인증 코드 발송 에러:', error);
      alert('인증 코드 발송에 실패했습니다.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    setEmailVerifying(true);
    
    try {
      const response = await validationService.verifyEmailCode(formData.email, emailCode);
      
      if (response.verified) {
        setEmailVerified(true);
        alert(response.message);
      } else {
        alert('인증에 실패했습니다. 인증 코드를 확인해주세요.');
      }
    } catch (error) {
      console.error('이메일 인증 에러:', error);
      alert('인증 코드가 일치하지 않습니다.');
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleFindAddress = () => {
    // TODO: 주소 찾기 API 연동 (다음 주소 API 등)
    console.log('주소 찾기');
    alert('주소 찾기 기능을 연동해주세요.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 유효성 검사
    if (loginIdStatus !== 'available') {
      alert('로그인 ID 중복 확인을 완료해주세요.');
      setIsLoading(false);
      return;
    }

    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.');
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      alert('비밀번호 조건을 확인해주세요.');
      setIsLoading(false);
      return;
    }

    if (!passwordConfirmValidation.isValid) {
      alert('비밀번호 확인을 확인해주세요.');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert('필수 약관에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.register({
        loginId: formData.loginId,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        detailAddress: formData.detailAddress,
        postalCode: formData.postalCode,
      });
      
      alert('회원가입이 완료되었습니다!');
      // 회원가입 성공 시 로그인 페이지로 이동
      window.location.href = '/login';
      
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              로그인하기
            </Link>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 로그인 ID */}
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
                로그인 ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="loginId"
                name="loginId"
                type="text"
                required
                value={formData.loginId}
                onChange={handleChange}
                onBlur={handleLoginIdBlur}
                placeholder="로그인 ID를 입력하세요"
                className="mt-1"
              />
              {loginIdStatus === 'checking' && (
                <p className="mt-1 text-sm text-blue-600">중복 확인 중...</p>
              )}
              {loginIdStatus === 'available' && (
                <p className="mt-1 text-sm text-green-600">✓ {loginIdMessage}</p>
              )}
              {loginIdStatus === 'unavailable' && (
                <p className="mt-1 text-sm text-red-600">✗ {loginIdMessage}</p>
              )}
              {loginIdStatus === 'idle' && loginIdMessage && (
                <p className="mt-1 text-sm text-red-600">{loginIdMessage}</p>
              )}
            </div>

            {/* 이메일 인증 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex space-x-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="flex-1"
                  disabled={emailVerified}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendEmailCode}
                  disabled={emailVerified || emailSending}
                  className="whitespace-nowrap"
                >
                  {emailVerified ? '인증완료' : emailSending ? '발송중...' : '인증요청'}
                </Button>
              </div>
            </div>

            {/* 이메일 인증 코드 입력 */}
            {showEmailVerification && !emailVerified && (
              <div>
                <label htmlFor="emailCode" className="block text-sm font-medium text-gray-700">
                  인증 코드
                </label>
                <div className="mt-1 flex space-x-2">
                  <Input
                    id="emailCode"
                    name="emailCode"
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder="인증 코드를 입력하세요"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleVerifyEmail}
                    disabled={emailVerifying}
                    className="whitespace-nowrap"
                  >
                    {emailVerifying ? '확인중...' : '인증확인'}
                  </Button>
                </div>
              </div>
            )}

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="8자 이상, 영문/숫자/특수문자 중 2가지 이상"
                className="mt-1"
              />
              
              {/* 비밀번호 강도 */}
              {formData.password && (
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
              {formData.password && passwordValidation.errors.length > 0 && (
                <div className="mt-2">
                  {passwordValidation.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">• {error}</p>
                  ))}
                </div>
              )}
              
              {/* 비밀번호 조건 체크리스트 */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600">비밀번호 조건:</div>
                  <div className={`text-xs flex items-center ${
                    passwordValidation.requirements.length ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <span className="mr-1">{passwordValidation.requirements.length ? '✓' : '○'}</span>
                    8자 이상
                  </div>
                  <div className={`text-xs flex items-center ${
                    passwordValidation.requirements.combinationCount >= 2 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <span className="mr-1">{passwordValidation.requirements.combinationCount >= 2 ? '✓' : '○'}</span>
                    영문/숫자/특수문자 중 2가지 이상 ({passwordValidation.requirements.combinationCount}/4)
                  </div>
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인 <span className="text-red-500">*</span>
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

            {/* 개인정보 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름 <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                className="mt-1"
              />
            </div>

            {/* 주소 */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                우편번호
              </label>
              <div className="mt-1 flex space-x-2">
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="우편번호"
                  className="flex-1"
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFindAddress}
                  className="whitespace-nowrap"
                >
                  주소찾기
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                주소
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소"
                className="mt-1"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">
                상세주소
              </label>
              <Input
                id="detailAddress"
                name="detailAddress"
                type="text"
                value={formData.detailAddress}
                onChange={handleChange}
                placeholder="상세주소를 입력하세요"
                className="mt-1"
              />
            </div>

            {/* 약관 동의 */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                    <span className="text-red-500">*</span> 이용약관에 동의합니다.{' '}
                    <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                      [보기]
                    </Link>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="agreePrivacy"
                    name="agreePrivacy"
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreePrivacy" className="ml-2 block text-sm text-gray-900">
                    <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다.{' '}
                    <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                      [보기]
                    </Link>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="agreeMarketing"
                    name="agreeMarketing"
                    type="checkbox"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeMarketing" className="ml-2 block text-sm text-gray-900">
                    마케팅 정보 수신에 동의합니다. (선택)
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3"
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
} 