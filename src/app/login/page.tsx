'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/auth';

export default function LoginPage() {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 상태인지 간단하게 확인
  useEffect(() => {
    // localStorage로 간단한 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      window.location.href = '/';
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login({
        login_id: formData.loginId,
        password: formData.password,
      });
      
      // 로그인 상태 저장
      localStorage.setItem('isLoggedIn', 'true');
      
      // 사용자 정보 조회 후 저장
      try {
        const userData = await authService.getCurrentUser({ skipAuthRedirect: true });
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // 헤더에 사용자 정보 전달 (이벤트 발생)
        window.dispatchEvent(new CustomEvent('userLogin', { detail: userData }));
      } catch (error) {
        console.warn('사용자 정보 조회 실패:', error);
      }
      
      // 로그인 성공 시 즉시 메인화면으로 이동
      window.location.href = '/';
      
    } catch (error) {
      console.error('로그인 에러:', error);
      showError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link 
              href="/register" 
              className="text-gray-900 hover:text-gray-700 underline"
            >
              회원가입하기
            </Link>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-center space-x-6">
              <div className="text-sm">
                <Link 
                  href="/forgot-id" 
                  className="text-gray-900 hover:text-gray-700 underline"
                >
                  아이디 찾기
                </Link>
              </div>
              <div className="text-sm">
                <Link 
                  href="/forgot-password" 
                  className="text-gray-900 hover:text-gray-700 underline"
                >
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => console.log('구글 로그인')}
                className="w-full"
              >
                구글로 로그인
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => console.log('카카오 로그인')}
                className="w-full"
              >
                카카오 로그인
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 