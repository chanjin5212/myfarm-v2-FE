'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/auth';

export default function OrdersPage() {
  const { success, error: showError, info } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

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

  const handleViewDetail = () => {
    info('주문 상세보기 기능은 준비 중입니다.');
  };

  const handleReorder = () => {
    info('재주문 기능은 준비 중입니다.');
  };

  const handleWriteReview = () => {
    info('리뷰 작성 기능은 준비 중입니다.');
  };

  const handleCancelOrder = () => {
    info('주문 취소 기능은 준비 중입니다.');
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

  const tabs = [
    { key: 'all', label: '전체', count: 5 },
    { key: 'processing', label: '처리중', count: 1 },
    { key: 'shipped', label: '배송중', count: 1 },
    { key: 'delivered', label: '배송완료', count: 2 },
    { key: 'cancelled', label: '취소/반품', count: 1 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/mypage" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            마이페이지로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">주문내역</h1>
          <p className="mt-2 text-gray-600">주문 현황과 내역을 확인할 수 있습니다.</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* 주문 목록 */}
        <div className="space-y-6">
          {/* 주문 1 - 배송완료 */}
          <Card className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">주문번호: ORD-2024-001</h3>
                  <p className="text-sm text-gray-600">2024.01.15 주문</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  배송완료
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">유기농 토마토 1kg</h4>
                  <p className="text-sm text-gray-600">수량: 2개</p>
                  <p className="text-sm font-medium text-gray-900">15,000원</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleWriteReview}>
                    리뷰 작성
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReorder}>
                    재주문
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">신선한 상추 500g</h4>
                  <p className="text-sm text-gray-600">수량: 1개</p>
                  <p className="text-sm font-medium text-gray-900">8,000원</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleWriteReview}>
                    리뷰 작성
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReorder}>
                    재주문
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  총 주문금액: <span className="font-medium text-gray-900">23,000원</span>
                </div>
                <Button variant="outline" onClick={handleViewDetail}>
                  주문 상세보기
                </Button>
              </div>
            </div>
          </Card>

          {/* 주문 2 - 배송중 */}
          <Card className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">주문번호: ORD-2024-002</h3>
                  <p className="text-sm text-gray-600">2024.01.20 주문</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  배송중
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">제주 감귤 2kg</h4>
                  <p className="text-sm text-gray-600">수량: 1박스</p>
                  <p className="text-sm font-medium text-gray-900">25,000원</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    배송중
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  총 주문금액: <span className="font-medium text-gray-900">25,000원</span>
                </div>
                <Button variant="outline" onClick={handleViewDetail}>
                  주문 상세보기
                </Button>
              </div>
            </div>
          </Card>

          {/* 주문 3 - 처리중 */}
          <Card className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">주문번호: ORD-2024-003</h3>
                  <p className="text-sm text-gray-600">2024.01.22 주문</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  처리중
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">친환경 계란 30개입</h4>
                  <p className="text-sm text-gray-600">수량: 1팩</p>
                  <p className="text-sm font-medium text-gray-900">12,000원</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCancelOrder}>
                    주문 취소
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  총 주문금액: <span className="font-medium text-gray-900">12,000원</span>
                </div>
                <Button variant="outline" onClick={handleViewDetail}>
                  주문 상세보기
                </Button>
              </div>
            </div>
          </Card>

          {/* 빈 상태 (실제 데이터가 없을 때 표시할 내용) */}
          <Card className="p-12 text-center border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">주문내역이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">
              첫 주문을 해보세요.
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button>
                  쇼핑하러 가기
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              이전
            </button>
            <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              1
            </button>
            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              2
            </button>
            <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              3
            </button>
            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              다음
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 