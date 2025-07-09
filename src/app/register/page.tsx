'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { validationService } from '@/lib/services/validation';
import { authService } from '@/lib/services/auth';
import { shippingService } from '@/lib/services/shipping';
import { validatePassword, validatePasswordConfirm, getPasswordStrength } from '@/utils/validation';
import { VerificationType } from '@/types/api';

export default function RegisterPage() {
  const { success, error: showError, info } = useToast();
  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
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
      showError('이메일을 입력해주세요.');
      return;
    }

    setEmailSending(true);
    
    try {
      const response = await validationService.sendEmailVerificationCode(formData.email, VerificationType.REGISTRATION);
      setShowEmailVerification(true);
      success(response.message);
    } catch (error) {
      console.error('이메일 인증 코드 발송 에러:', error);
      showError('인증 코드 발송에 실패했습니다.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailCode) {
      showError('인증 코드를 입력해주세요.');
      return;
    }

    setEmailVerifying(true);
    
    try {
      const response = await validationService.verifyEmailCode(formData.email, emailCode);
      
      if (response.verified) {
        setEmailVerified(true);
        success(response.message);
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

  const handleFindAddress = () => {
    // 다음주소 API 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => {
      // 스크립트 로드 완료 후 주소 검색 팝업 열기
      new (window as any).daum.Postcode({
        oncomplete: function(data: any) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
          
          // 각 주소의 노출 규칙에 따라 주소를 조합한다
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다
          let addr = ''; // 주소 변수
          let extraAddr = ''; // 참고항목 변수

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다
          if (data.userSelectedType === 'R') {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
          }

          // 우편번호와 주소 정보를 해당 필드에 넣는다
          setFormData(prev => ({
            ...prev,
            postalCode: data.zonecode,
            address: addr + extraAddr
          }));

          // 커서를 상세주소 필드로 이동한다
          document.getElementById('detailAddress')?.focus();
        }
      }).open();
    };
    
    // 스크립트가 이미 로드되었는지 확인
    if (!document.querySelector('script[src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]')) {
      document.head.appendChild(script);
    } else {
      // 이미 로드되어 있으면 바로 팝업 열기
      new (window as any).daum.Postcode({
        oncomplete: function(data: any) {
          let addr = '';
          let extraAddr = '';

          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }

          if (data.userSelectedType === 'R') {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
          }

          setFormData(prev => ({
            ...prev,
            postalCode: data.zonecode,
            address: addr + extraAddr
          }));

          document.getElementById('detailAddress')?.focus();
        }
      }).open();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 유효성 검사
    if (loginIdStatus !== 'available') {
      showError('로그인 ID 중복 확인을 완료해주세요.');
      setIsLoading(false);
      return;
    }

    if (!emailVerified) {
      showError('이메일 인증을 완료해주세요.');
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      showError('비밀번호 조건을 확인해주세요.');
      setIsLoading(false);
      return;
    }

    if (!passwordConfirmValidation.isValid) {
      showError('비밀번호 확인을 확인해주세요.');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      showError('필수 약관에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        email: formData.email,
        login_id: formData.loginId,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname || undefined,
        phone_number: formData.phone || undefined,
        postcode: formData.postalCode || undefined,
        address: formData.address || undefined,
        detail_address: formData.detailAddress || undefined,
        terms_agreed: formData.agreeTerms && formData.agreePrivacy,
        marketing_agreed: formData.agreeMarketing,
      });
      
      success('회원가입이 완료되었습니다!');
      // 회원가입 성공 시 로그인 페이지로 이동
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
    } catch (error) {
      console.error('회원가입 에러:', error);
      showError('회원가입에 실패했습니다.');
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
              className="text-gray-900 hover:text-gray-700 underline"
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
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임 <span className="text-gray-400">(선택)</span>
              </label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요 (선택사항)"
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