'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/auth';

export default function ShippingPage() {
  const { success, error: showError, info } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuth = async () => {
      try {
        await authService.getCurrentUser();
        setIsLoading(false);
      } catch (error) {
        console.error('인증 확인 에러:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);

  const handleAddAddress = () => {
    info('배송지 추가 기능은 준비 중입니다.');
  };

  const handleEditAddress = () => {
    info('배송지 수정 기능은 준비 중입니다.');
  };

  const handleDeleteAddress = () => {
    info('배송지 삭제 기능은 준비 중입니다.');
  };

  const handleSetDefault = () => {
    info('기본 배송지 설정 기능은 준비 중입니다.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">페이지 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/mypage" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            마이페이지로 돌아가기
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">배송지 관리</h1>
              <p className="mt-2 text-gray-600">배송지를 추가, 수정, 삭제할 수 있습니다.</p>
            </div>
            <Button onClick={handleAddAddress}>
              배송지 추가
            </Button>
          </div>
        </div>

        {/* 배송지 목록 */}
        <div className="space-y-4">
          {/* 기본 배송지 */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">홍길동</h3>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    기본 배송지
                  </span>
                </div>
                <p className="text-gray-600 mb-1">010-1234-5678</p>
                <p className="text-gray-600 mb-1">(12345) 서울특별시 강남구 테헤란로 123</p>
                <p className="text-gray-600">상세주소: 1층 101호</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleEditAddress}>
                  수정
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeleteAddress}>
                  삭제
                </Button>
              </div>
            </div>
          </Card>

          {/* 일반 배송지 */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">김철수</h3>
                </div>
                <p className="text-gray-600 mb-1">010-9876-5432</p>
                <p className="text-gray-600 mb-1">(54321) 부산광역시 해운대구 해운대로 456</p>
                <p className="text-gray-600">상세주소: 아파트 201동 1203호</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleSetDefault}>
                  기본 설정
                </Button>
                <Button variant="outline" size="sm" onClick={handleEditAddress}>
                  수정
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeleteAddress}>
                  삭제
                </Button>
              </div>
            </div>
          </Card>

          {/* 빈 상태 (실제 데이터가 없을 때 표시할 내용) */}
          <Card className="p-12 text-center border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">배송지가 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">
              첫 배송지를 추가해보세요.
            </p>
            <div className="mt-6">
              <Button onClick={handleAddAddress}>
                배송지 추가
              </Button>
            </div>
          </Card>
        </div>

        {/* 안내 사항 */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                배송지 관리 안내
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>최대 10개의 배송지를 등록할 수 있습니다.</li>
                  <li>기본 배송지는 주문 시 자동으로 선택됩니다.</li>
                  <li>배송지는 언제든지 추가, 수정, 삭제할 수 있습니다.</li>
                  <li>현재 모든 기능은 준비 중입니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 