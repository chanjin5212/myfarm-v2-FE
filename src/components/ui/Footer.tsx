import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 브랜드 소개 */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🥔</span>
              <h4 className="text-xl font-bold">강원찐농부</h4>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              최고 품질의 농산물을 직배송합니다.
            </p>
            
            {/* 회사 정보 */}
            <div className="text-sm text-gray-400 space-y-2">
              <div>
                <span className="font-semibold text-white">상호명:</span> 강원찐농부 | 
                <span className="font-semibold text-white ml-2">대표:</span> 이창덕
              </div>
              <div>
                <span className="font-semibold text-white">사업자등록번호:</span> 302-92-02762
              </div>
              <div>
                <span className="font-semibold text-white">주소:</span> 강원특별자치도 고성군 간성읍 어천1길11
              </div>
              <div>
                <span className="font-semibold text-white">전화:</span> 010-5796-2201 | 
                <span className="font-semibold text-white ml-2">이메일:</span> oho1114@naver.com
              </div>
            </div>
          </div>
          
          {/* 고객 지원 */}
          <div>
            <h5 className="font-semibold mb-4 text-lg">고객 지원</h5>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/company" className="hover:text-white transition-colors">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 연락처 */}
          <div>
            <h5 className="font-semibold mb-4 text-lg">문의하기</h5>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>010-5796-2201</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>oho1114@naver.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>📍</span>
                <span className="leading-relaxed">강원특별자치도 고성군<br />간성읍 어천1길11</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 카피라이트 */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 강원찐농부 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 