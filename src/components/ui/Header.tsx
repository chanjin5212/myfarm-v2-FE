'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🥔</span>
            <Link href="/" className="text-2xl font-bold text-potato-600 hover:text-potato-700 transition-colors">
              강원찐농부
            </Link>
          </div>
          
          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-potato-500 transition-colors font-medium">
              상품
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-potato-500 transition-colors font-medium">
              장바구니
            </Link>
            <Link href="/mypage" className="text-gray-600 hover:text-potato-500 transition-colors font-medium">
              마이페이지
            </Link>
          </nav>
          
          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:text-potato-500 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="text-gray-600 hover:text-potato-500 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                상품
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-600 hover:text-potato-500 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                장바구니
              </Link>
              <Link 
                href="/mypage" 
                className="text-gray-600 hover:text-potato-500 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                마이페이지
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 