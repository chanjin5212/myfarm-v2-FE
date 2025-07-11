'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/auth';

export default function ReviewsPage() {
  const { success, error: showError, info } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'written' | 'pending'>('written');

  const handleEditReview = () => {
    info('리뷰 수정 기능은 준비 중입니다.');
  };

  const handleDeleteReview = () => {
    info('리뷰 삭제 기능은 준비 중입니다.');
  };

  const handleWriteReview = () => {
    info('리뷰 작성 기능은 준비 중입니다.');
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">리뷰관리</h1>
          <p className="mt-2 text-gray-600">작성한 리뷰를 확인하고 관리할 수 있습니다.</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('written')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'written'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              작성한 리뷰 (3)
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              작성 가능한 리뷰 (2)
            </button>
          </nav>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-6">
          {activeTab === 'written' && (
            <>
              {/* 작성한 리뷰 1 */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">유기농 토마토 1kg</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEditReview}>
                          수정
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDeleteReview}>
                          삭제
                        </Button>
                      </div>
                    </div>
                    
                    {renderStars(5)}
                    
                    <div className="mt-3">
                      <p className="text-gray-700">
                        정말 맛있고 신선한 토마토였어요! 당도도 높고 아이들이 너무 좋아해서 재주문 예정입니다. 
                        포장도 꼼꼼히 해주셔서 하나도 상하지 않고 잘 받았습니다.
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>2024.01.18 작성</span>
                      <span className="mx-2">•</span>
                      <span>주문번호: ORD-2024-001</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 작성한 리뷰 2 */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">신선한 상추 500g</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEditReview}>
                          수정
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDeleteReview}>
                          삭제
                        </Button>
                      </div>
                    </div>
                    
                    {renderStars(4)}
                    
                    <div className="mt-3">
                      <p className="text-gray-700">
                        상추가 정말 싱싱하고 좋았어요. 다만 조금 작은 편이라 아쉬웠습니다. 
                        그래도 맛은 좋았어요!
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>2024.01.17 작성</span>
                      <span className="mx-2">•</span>
                      <span>주문번호: ORD-2024-001</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 작성한 리뷰 3 */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">제주 감귤 2kg</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleEditReview}>
                          수정
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDeleteReview}>
                          삭제
                        </Button>
                      </div>
                    </div>
                    
                    {renderStars(5)}
                    
                    <div className="mt-3">
                      <p className="text-gray-700">
                        제주 감귤 정말 달고 맛있어요! 크기도 적당하고 껍질도 잘 벗겨져서 
                        먹기 편했습니다. 다음에도 꼭 주문할게요.
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>2024.01.23 작성</span>
                      <span className="mx-2">•</span>
                      <span>주문번호: ORD-2024-002</span>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'pending' && (
            <>
              {/* 작성 가능한 리뷰 1 */}
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">친환경 계란 30개입</h3>
                    <p className="text-sm text-gray-600 mt-1">주문번호: ORD-2024-003</p>
                    <p className="text-sm text-gray-500">2024.01.22 구매</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleWriteReview}>
                      리뷰 작성
                    </Button>
                  </div>
                </div>
              </Card>

              {/* 작성 가능한 리뷰 2 */}
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">유기농 브로콜리 1개</h3>
                    <p className="text-sm text-gray-600 mt-1">주문번호: ORD-2024-004</p>
                    <p className="text-sm text-gray-500">2024.01.25 구매</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleWriteReview}>
                      리뷰 작성
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* 빈 상태 */}
          {((activeTab === 'written' && false) || (activeTab === 'pending' && false)) && (
            <Card className="p-12 text-center border-2 border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {activeTab === 'written' ? '작성한 리뷰가 없습니다' : '작성 가능한 리뷰가 없습니다'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'written' 
                  ? '상품을 구매하고 첫 리뷰를 작성해보세요.' 
                  : '상품을 구매하면 리뷰를 작성할 수 있습니다.'
                }
              </p>
              <div className="mt-6">
                <Link href="/">
                  <Button>
                    쇼핑하러 가기
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* 리뷰 안내 */}
        <Card className="mt-8 p-6 bg-yellow-50 border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                리뷰 작성 안내
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>상품을 받으신 후 7일 이내에 리뷰를 작성하시면 적립금을 드립니다.</li>
                  <li>사진 리뷰 작성 시 추가 적립금을 제공합니다.</li>
                  <li>허위 리뷰나 부적절한 내용은 삭제될 수 있습니다.</li>
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