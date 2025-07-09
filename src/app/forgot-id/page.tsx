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

export default function FindIdPage() {
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [foundId, setFoundId] = useState('');
  const [step, setStep] = useState<'email' | 'verification' | 'result'>('email');
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [findingId, setFindingId] = useState(false);

  const handleSendEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showError('이메일을 입력해주세요.');
      return;
    }

    setEmailSending(true);
    
    try {
      const response = await validationService.sendEmailVerificationCode(email, VerificationType.FIND_ID);
      setStep('verification');
      success(response.message);
    } catch (error) {
      console.error('이메일 인증 코드 발송 에러:', error);
      showError('인증 코드 발송에 실패했습니다.');
    } finally {
      setEmailSending(false);
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
      const verifyResponse = await validationService.verifyEmailCode(email, emailCode);
      
      if (verifyResponse.verified) {
        // 인증 성공 시 아이디 찾기 API 호출
        setFindingId(true);
        
        try {
          const findIdResponse = await authService.findId(email);
          setFoundId(findIdResponse.login_id);
          setStep('result');
          success('아이디를 찾았습니다!');
        } catch (findIdError) {
          console.error('아이디 찾기 에러:', findIdError);
          showError('아이디를 찾을 수 없습니다.');
        } finally {
          setFindingId(false);
        }
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

  const handleStartOver = () => {
    setEmail('');
    setEmailCode('');
    setFoundId('');
    setStep('email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            아이디 찾기
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이메일 인증을 통해 아이디를 찾아드립니다.
          </p>
        </div>

        <Card className="p-8">
          {step === 'email' && (
            <form className="space-y-6" onSubmit={handleSendEmailCode}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일 주소
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={emailSending}
                className="w-full flex justify-center py-2 px-4"
              >
                {emailSending ? '인증 코드 발송 중...' : '인증 코드 발송'}
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
                  value={email}
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
                  disabled={emailVerifying || findingId}
                  className="flex-1"
                >
                  {emailVerifying ? '인증 중...' : findingId ? '아이디 찾는 중...' : '인증 확인'}
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
                  아이디를 찾았습니다!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  회원님의 아이디는 다음과 같습니다:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">{foundId}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartOver}
                  className="flex-1"
                >
                  다른 아이디 찾기
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