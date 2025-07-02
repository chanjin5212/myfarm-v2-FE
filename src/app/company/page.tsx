import React from 'react';
import { Card } from '@/components/ui';

export default function CompanyPage() {

  const companyInfo = [
    { label: '상호명', value: '강원찐농부' },
    { label: '대표', value: '이창덕' },
    { label: '설립일', value: '2025년 5월 01일' },
    { label: '사업자등록번호', value: '302-92-02762' },
    { label: '주소', value: '강원특별자치도 고성군 간성읍 어천1길 11' },
    { label: '전화', value: '010-5796-2201' },
    { label: '이메일', value: 'oho1114@naver.com' }
  ];

  return (
    <div>

      {/* 메인 컨텐츠 */}
      <main className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              회사소개
            </h1>
            <div className="w-24 h-1 bg-potato-400 mx-auto"></div>
          </div>

          {/* 회사 소개 섹션 */}
          <div className="space-y-12 md:space-y-16">
            
            {/* 회사 개요 */}
            <Card className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-3 mb-6">
                  <span className="text-4xl">🥔</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-potato-600">강원찐농부</h2>
                </div>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  강원찐농부는 <span className="font-semibold text-potato-600">2025년 설립된 농산물 직거래 플랫폼</span>으로, 
                  신선하고 품질 좋은 농산물을 합리적인 가격에 소비자에게 직접 제공하는 것을 목표로 하고 있습니다.
                </p>
              </div>
            </Card>

            {/* 회사 슬로건 */}
            <Card className="p-8 md:p-12 bg-gradient-to-r from-potato-100 to-potato-200 border-none">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">회사 슬로건</h3>
                <div className="relative">
                  <blockquote className="text-2xl md:text-4xl font-bold text-potato-700 mb-6 italic">
                    "농부의 정성을 식탁까지"
                  </blockquote>
                  <div className="flex justify-center mb-6">
                    <div className="flex space-x-2">
                      <span className="text-2xl">🌾</span>
                      <span className="text-2xl">❤️</span>
                      <span className="text-2xl">🍽️</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  생산자와 소비자를 직접 연결하여 중간 유통과정을 줄이고 
                  더 신선한 농산물을 더 합리적인 가격에 제공합니다.
                </p>
              </div>
            </Card>

            {/* 회사 정보 */}
            <Card className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">회사 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {companyInfo.map((info, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center p-4 bg-gray-50 rounded-lg">
                    <div className="sm:w-32 mb-2 sm:mb-0">
                      <span className="text-sm font-semibold text-potato-600 uppercase tracking-wide">
                        {info.label}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium">
                        {info.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 연락처 강조 */}
              <div className="mt-12 p-6 bg-potato-50 rounded-xl border border-potato-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">연락처</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">📞</span>
                    <span className="text-lg font-medium text-gray-700">010-5796-2201</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">📧</span>
                    <span className="text-lg font-medium text-gray-700">oho1114@naver.com</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 위치 정보 */}
            <Card className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">찾아오시는 길</h3>
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className="text-2xl">📍</span>
                  <span className="text-lg font-medium text-gray-700">
                    강원특별자치도 고성군 간성읍 어천1길 11
                  </span>
                </div>
                <p className="text-gray-600 mt-4">
                  청정한 강원도 고성에서 최고의 농산물을 생산하고 있습니다.
                </p>
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
} 