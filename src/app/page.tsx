'use client';

import React from 'react';
import { 
  Button, 
  ProductCard, 
  InfoCard, 
  SearchInput 
} from '@/components/ui';

export default function Home() {

  const featuredProducts = [
    {
      id: 1,
      title: "고성 감자",
      price: 15000,
      originalPrice: 18000,
      description: "강원 고성의 청정한 고랭지에서 자란 프리미엄 감자입니다. 당도가 높고 식감이 부드러워요.",
      badge: "인기상품",
      image: undefined
    },
    {
      id: 2,
      title: "강원 옥수수",
      price: 12000,
      description: "달콤하고 촉촉한 강원도 햇 옥수수입니다. 자연 그대로의 단맛을 느껴보세요.",
      badge: "신상품",
      image: undefined
    },
    {
      id: 3,
      title: "유기농 배추",
      price: 8000,
      originalPrice: 10000,
      description: "무농약으로 재배한 싱싱한 배추입니다. 김치 담그기에 최적화된 품질입니다.",
      badge: "유기농",
      image: undefined
    }
  ];

  const benefits = [
    {
      icon: <span className="text-2xl">🚚</span>,
      title: "신선배송",
      content: "수확 후 24시간 내 전국 직배송으로 가장 신선한 상태로 받아보세요."
    },
    {
      icon: <span className="text-2xl">🏔️</span>,
      title: "강원도 직송",
      content: "청정 강원도에서 직접 재배한 고품질 농산물만을 엄선해서 보내드립니다."
    },
    {
      icon: <span className="text-2xl">💰</span>,
      title: "합리적 가격",
      content: "중간 유통업체 없이 농장에서 직접 판매하여 더욱 합리적인 가격으로 제공합니다."
    },
    {
      icon: <span className="text-2xl">🌱</span>,
      title: "안전한 농산물",
      content: "농약 사용을 최소화하고 친환경 농법으로 키운 안전한 농산물입니다."
    }
  ];

  return (
    <div>

      {/* 메인 히어로 섹션 */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            강원도에서 온<br />
            <span className="text-potato-500">진짜 농산물</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            청정 강원도 고성에서 정성스럽게 키운 신선한 농산물을 농장에서 직접 보내드립니다.<br />
            중간 유통 없이 가장 신선하고 합리적인 가격으로 만나보세요.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <SearchInput
              placeholder="원하는 농산물을 검색하세요..."
              onSearch={(value) => alert(`"${value}" 검색 기능은 준비 중입니다.`)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              상품 둘러보기
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              농장 이야기
            </Button>
          </div>
        </div>
      </section>

      {/* 추천 상품 섹션 */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">인기 상품</h2>
            <p className="text-gray-600 text-lg">고객들이 가장 많이 찾는 강원도 농산물</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                description={product.description}
                badge={product.badge}
                image={product.image}
                onAddToCart={() => alert(`${product.title}이(가) 장바구니에 추가되었습니다!`)}
                onViewDetails={() => alert(`${product.title} 상세페이지는 준비 중입니다.`)}
              />
            ))}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <Button variant="outline" size="lg">
              모든 상품 보기 →
            </Button>
          </div>
        </div>
      </section>

      {/* 서비스 특장점 섹션 */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">강원찐농부의 약속</h2>
            <p className="text-gray-600 text-lg">고객 만족을 위한 우리의 특별한 서비스</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <InfoCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                content={benefit.content}
                className="text-center h-full"
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
