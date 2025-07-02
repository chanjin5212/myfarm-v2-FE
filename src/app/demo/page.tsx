'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Loading, 
  Cards, 
  Inputs, 
  LoadingSpinner,
  LoadingOverlay,
  Skeleton,
  CardSkeleton,
  Card,
  ProductCard,
  InfoCard,
  Input,
  TextArea,
  Select,
  SearchInput
} from '@/components/ui';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };
  
  const handleOverlayDemo = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {showOverlay && (
        <LoadingOverlay 
          message="데모 로딩 중입니다..." 
          fullScreen={true}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥔 농산물 판매 사이트 디자인 시스템
          </h1>
          <p className="text-xl text-gray-600">
            감자색을 기반으로 한 UI 컴포넌트 라이브러리
          </p>
        </div>

        {/* 버튼 섹션 */}
        <section className="mb-16">
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">버튼 컴포넌트</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">버튼 스타일</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary 버튼</Button>
                  <Button variant="secondary">Secondary 버튼</Button>
                  <Button variant="outline">Outline 버튼</Button>
                  <Button variant="ghost">Ghost 버튼</Button>
                  <Button variant="danger">Danger 버튼</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">버튼 크기</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">로딩 상태</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading={loading} onClick={handleLoadingDemo}>
                    {loading ? '로딩 중...' : '로딩 테스트'}
                  </Button>
                  <Button variant="outline" disabled>비활성화</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 로딩 섹션 */}
        <section className="mb-16">
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">로딩 컴포넌트</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">로딩 스피너</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <LoadingSpinner size="sm" />
                    <p className="text-sm text-gray-500 mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="md" />
                    <p className="text-sm text-gray-500 mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-gray-500 mt-2">Large</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner color="green" />
                    <p className="text-sm text-gray-500 mt-2">Green</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">스켈레톤 로딩</h3>
                <div className="space-y-4">
                  <Skeleton className="w-full" />
                  <Skeleton rows={3} className="w-3/4" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">오버레이 로딩</h3>
                <Button onClick={handleOverlayDemo}>
                  전체 화면 로딩 테스트
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 카드 섹션 */}
        <section className="mb-16">
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">카드 컴포넌트</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard
                title="국내산 감자"
                price={5000}
                originalPrice={7000}
                description="신선하고 맛있는 국내산 감자입니다. 다양한 요리에 활용하세요."
                badge="신상품"
                onAddToCart={() => alert('장바구니에 추가되었습니다!')}
                onViewDetails={() => alert('상세페이지로 이동합니다!')}
              />
              
              <ProductCard
                title="유기농 당근"
                price={8000}
                description="농약을 사용하지 않은 안전한 유기농 당근"
                badge="유기농"
                onAddToCart={() => alert('장바구니에 추가되었습니다!')}
                onViewDetails={() => alert('상세페이지로 이동합니다!')}
              />
              
              <InfoCard
                icon={<span>🚚</span>}
                title="빠른 배송"
                content="주문 후 24시간 내 신선한 농산물을 배송해드립니다."
              />
            </div>
          </Card>
        </section>

        {/* 입력 섹션 */}
        <section className="mb-16">
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">입력 컴포넌트</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="이름"
                  placeholder="이름을 입력하세요"
                  helperText="한글 또는 영문으로 입력해주세요"
                />
                
                <Input
                  label="이메일"
                  type="email"
                  placeholder="email@example.com"
                  error="올바른 이메일 형식이 아닙니다"
                />
                
                <SearchInput
                  label="상품 검색"
                  placeholder="상품명을 검색하세요..."
                  onSearch={(value) => alert(`검색어: ${value}`)}
                />
              </div>
              
              <div className="space-y-4">
                <Select
                  label="카테고리"
                  placeholder="카테고리를 선택하세요"
                  options={[
                    { value: 'potato', label: '감자류' },
                    { value: 'vegetable', label: '채소류' },
                    { value: 'fruit', label: '과일류' }
                  ]}
                />
                
                <TextArea
                  label="상품 설명"
                  placeholder="상품에 대한 자세한 설명을 입력하세요..."
                  helperText="최대 500자까지 입력 가능합니다"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* 컬러 팔레트 */}
        <section className="mb-16">
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">컬러 팔레트</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">감자색 팔레트</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { name: '50', color: '#fef9f3', isPrimary: false },
                    { name: '100', color: '#fef2e2', isPrimary: false },
                    { name: '200', color: '#fde1c8', isPrimary: false },
                    { name: '300', color: '#fbc8a3', isPrimary: true },
                    { name: '400', color: '#f7a76c', isPrimary: false },
                    { name: '500', color: '#f38744', isPrimary: false },
                    { name: '600', color: '#e46f2a', isPrimary: false },
                    { name: '700', color: '#bc561f', isPrimary: false },
                    { name: '800', color: '#964620', isPrimary: false },
                    { name: '900', color: '#7a3b1d', isPrimary: false }
                  ].map((shade) => (
                    <div key={shade.name} className="text-center">
                      <div 
                        className={`w-full h-16 rounded-lg border mb-2 ${shade.isPrimary ? 'border-2 border-blue-500 shadow-md' : 'border-gray-200'}`}
                        style={{ backgroundColor: shade.color }}
                      ></div>
                      <p className={`text-xs ${shade.isPrimary ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                        {shade.name} {shade.isPrimary && '(Primary)'}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{shade.color}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  💡 파란색 테두리가 있는 색상이 현재 Primary 색상으로 사용됩니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">보조 색상</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: '잎 초록색', color: '#22c55e' },
                    { name: '흙 갈색', color: '#8b4513' },
                    { name: '햇살 노랑', color: '#facc15' },
                    { name: '하늘 파랑', color: '#38bdf8' }
                  ].map((color) => (
                    <div key={color.name} className="text-center">
                      <div 
                        className="w-full h-16 rounded-lg border border-gray-200 mb-2"
                        style={{ backgroundColor: color.color }}
                      ></div>
                      <p className="text-sm text-gray-600">{color.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{color.color}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
} 