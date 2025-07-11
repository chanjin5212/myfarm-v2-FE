'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth';
import { productService } from '@/lib/services/products';
import { useToast } from '@/components/ui/Toast';
import { MeResponse } from '@/types/user';
import { ProductSummary } from '@/types/product';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 초기 로딩 없음
  const { success, error: showError } = useToast();
  const router = useRouter();
  
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSummary[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 로그인 이벤트 감지 및 localStorage에서 사용자 정보 읽기
  useEffect(() => {
    // 초기 로드 시 localStorage에서 사용자 정보 확인
    const checkStoredUserData = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
          } catch (error) {
            console.warn('사용자 정보 파싱 실패:', error);
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    };

    // 초기 확인
    checkStoredUserData();

    // 로그인 이벤트 리스너
    const handleUserLogin = (event: any) => {
      setUser(event.detail);
    };

    // 로그아웃 이벤트 리스너
    const handleUserLogout = () => {
      setUser(null);
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
      if (showSearchResults && searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen, showSearchResults]);

  // 검색 함수
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await productService.getProducts({
        keyword: query,
        page: 0,
        size: 5, // 검색 결과는 5개만 표시
        sortBy: 'latest'
      });
      setSearchResults(response.products || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 검색 엔터키 처리
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 검색 결과 클릭 처리
  const handleSearchResultClick = (productId: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await authService.logout();
      
      // localStorage 정리
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      
      // 로그아웃 이벤트 발생
      window.dispatchEvent(new CustomEvent('userLogout'));
      
      setUser(null);
      success('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      showError('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 왼쪽: 메뉴 버튼 + 로고 */}
            <div className="flex items-center space-x-3">
              {/* 메뉴 버튼 */}
              <button
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:text-potato-500 hover:bg-gray-100 transition-colors"
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
              
              {/* 로고 */}
              <Link 
                href="/" 
                className="text-2xl font-bold text-potato-600 hover:text-potato-700 transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsUserDropdownOpen(false);
                }}
              >
                강원찐농부
              </Link>
            </div>
            
            {/* 오른쪽: 마이페이지, 장바구니 아이콘 */}
            <div className="flex items-center space-x-4">
              {/* 마이페이지 아이콘 */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:text-potato-500 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  
                  {/* 드롭다운 메뉴 */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                        {user.name}님
                      </div>
                      <Link 
                        href="/mypage" 
                        className="block px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        마이페이지
                      </Link>
                      <Link 
                        href="/mypage/orders" 
                        className="block px-4 py-2 text-gray-600 hover:text-potato-600 hover:bg-potato-50 transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        주문내역
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
                  className="flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:text-potato-500 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
              
              {/* 장바구니 아이콘 */}
              <Link 
                href="/cart" 
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:text-potato-500 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h14l-1 8H6L5 7zm0 0L3 3H2m3 4l1 8h10" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="15" cy="20" r="1" />
                </svg>
              </Link>
            </div>
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
      <div className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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

      {/* 검색 바 */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="상품을 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-potato-500 focus:border-transparent outline-none transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {searchLoading ? (
                  <div className="w-6 h-6 border-2 border-potato-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>

            {/* 검색 결과 드롭다운 */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSearchResultClick(product.id)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.thumbnailUrl ? (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-potato-600 font-semibold mt-1">
                            {new Intl.NumberFormat('ko-KR').format(product.price)}원
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* 더 많은 결과 보기 */}
                    <div className="border-t border-gray-200 mt-2">
                      <button
                        onClick={() => {
                          setShowSearchResults(false);
                          router.push(`/products?keyword=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="w-full px-4 py-3 text-center text-sm text-potato-600 hover:bg-potato-50 transition-colors duration-200"
                      >
                        '{searchQuery}' 전체 검색 결과 보기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p className="text-sm">검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 