'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/services/auth';
import { useToast } from '@/components/ui/Toast';
import { MeResponse } from '@/types/user';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: showError } = useToast();

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      success('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      showError('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
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
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium">
                상품
              </Link>
              <Link href="/cart" className="px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium">
                장바구니
              </Link>
              
              {/* 로그인 상태에 따른 조건부 렌더링 */}
              {isLoading ? (
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <div className="w-8 h-8 bg-potato-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span>{user.name}님</span>
                    <svg className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* 드롭다운 메뉴 */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link 
                        href="/mypage" 
                        className="block px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        마이페이지
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="px-6 py-2 bg-potato-500 text-white rounded-lg hover:bg-potato-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  로그인
                </Link>
              )}
            </nav>
            
            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:text-potato-500 hover:bg-gray-100 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsUserDropdownOpen(false);
              }}
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
        </div>
      </header>

      {/* 모바일 사이드바 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 모바일 사이드바 */}
      <div className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        
        <div className="flex flex-col h-screen overflow-hidden">
          {/* 헤더 영역 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">메뉴</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:text-potato-600 hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 상단 일반 메뉴 */}
          <nav className="px-6 py-2 space-y-1 flex-shrink-0">
            <Link 
              href="/products" 
              className="block px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              상품
            </Link>
            <Link 
              href="/cart" 
              className="block px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              장바구니
            </Link>
          </nav>
          
          {/* 스크롤 가능한 중간 영역 */}
          <div className="flex-1 overflow-y-auto">
            {/* 추가 메뉴가 있다면 여기에 */}
          </div>
          
          {/* 하단 사용자 정보 영역 */}
          <div className="flex-shrink-0 border-t border-gray-200 px-6 py-3">
            {isLoading ? (
              <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="space-y-1">
                {/* 사용자 정보 헤더 */}
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="w-10 h-10 bg-potato-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold text-sm">{user.name}님</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                </div>
                
                {/* 계정 메뉴 항목들 */}
                <Link 
                  href="/mypage" 
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  마이페이지
                </Link>
                
                <Link 
                  href="/mypage/orders" 
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  주문내역
                </Link>
                
                <div className="border-t border-gray-200 my-1"></div>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  로그아웃
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="block w-full text-center px-4 py-3 bg-potato-500 text-white rounded-lg hover:bg-potato-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 