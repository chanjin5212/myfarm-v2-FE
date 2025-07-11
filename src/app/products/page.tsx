'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/lib/services/products';
import { ProductSummary, ProductListRequest, ProductSortOption } from '@/types/product';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // 필터 및 페이지네이션 상태
  const [filters, setFilters] = useState<ProductListRequest>({
    page: 0,
    size: 20,
    sortBy: 'latest',
    keyword: searchParams.get('keyword') || undefined
  });
  

  
  // 필터 모달 상태
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // 필터 모달 내부 임시 상태
  const [tempFilters, setTempFilters] = useState<ProductListRequest>(filters);

  // 상품 목록 조회 함수
  const fetchProducts = async (newFilters: ProductListRequest = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts(newFilters);
      setProducts(response.products || []);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      console.error('상품 목록 조회 실패:', err);
      setError('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchProducts();
  }, []);

  // URL 파라미터 변경 감지
  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword !== filters.keyword) {
      const newFilters = {
        ...filters,
        keyword: keyword || undefined,
        page: 0
      };
      setFilters(newFilters);
      fetchProducts(newFilters);
    }
  }, [searchParams]);

  // 필터 변경 (API 호출 없이 상태만 업데이트)
  const handleFilterChange = (newFilters: Partial<ProductListRequest>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 0 }; // 필터 변경 시 첫 페이지로
    setFilters(updatedFilters);
  };



  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 페이지 계산
  const currentPage = filters.page || 0;
  const pageSize = filters.size || 20;
  const totalPages = Math.ceil((totalCount || 0) / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 결과 정보 및 필터 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{(totalCount || 0).toLocaleString()}</span>개의 상품
            {filters.keyword && (
              <span> ('{filters.keyword}' 검색 결과)</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 활성 필터 표시 (데스크톱에서만) */}
            {(filters.sortBy !== 'latest' || filters.minPrice || filters.maxPrice) && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-xs text-gray-500">활성 필터:</span>
                <div className="flex flex-wrap gap-1">
                  {filters.sortBy !== 'latest' && (
                    <span className="px-2 py-1 bg-potato-100 text-potato-800 text-xs rounded-full">
                      {filters.sortBy === 'priceDesc' ? '가격높은순' :
                       filters.sortBy === 'priceAsc' ? '가격낮은순' : filters.sortBy}
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="px-2 py-1 bg-potato-100 text-potato-800 text-xs rounded-full">
                      가격필터
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* 필터 버튼 */}
            <Button
              variant="outline"
              onClick={() => {
                setTempFilters(filters);
                setShowFilterModal(true);
              }}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>필터</span>
              {(filters.sortBy !== 'latest' || filters.minPrice || filters.maxPrice) && (
                <span className="ml-1 w-2 h-2 bg-potato-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="p-4">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* 상품 없음 */
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">검색 결과가 없습니다</div>
            <p className="text-gray-400 text-sm">다른 검색어나 필터를 사용해 보세요</p>
          </div>
        ) : (
          /* 상품 그리드 */
          <>
            {/* 모바일: 가로형 카드, 데스크톱: 세로형 카드 그리드 */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 mb-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    {/* 모바일: 가로형 레이아웃, 데스크톱: 세로형 레이아웃 */}
                    <div className="flex sm:block h-64 sm:h-auto">
                      {/* 상품 이미지 */}
                      <div className="w-64 h-64 sm:w-full sm:aspect-square bg-gray-100 rounded-l-lg sm:rounded-t-lg sm:rounded-l-lg overflow-hidden flex-shrink-0">
                        {product.thumbnailUrl ? (
                          <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-3xl sm:text-4xl">📦</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 상품 정보 */}
                      <div className="flex-1 p-4 sm:p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 sm:mb-2 text-sm sm:text-sm line-clamp-2 group-hover:text-potato-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex justify-between items-center mb-2 sm:mb-2">
                            <span className="text-lg sm:text-lg font-bold text-potato-600">
                              {formatPrice(product.price)}원
                            </span>
                          </div>
                        </div>
                        {/* 리뷰 정보 */}
                        <div className="flex items-center space-x-2 text-sm sm:text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const rating = product.averageRating;
                                const fillPercentage = rating >= star ? 100 : rating >= star - 1 ? (rating - (star - 1)) * 100 : 0;
                                
                                return (
                                  <div key={star} className="relative">
                                    <span className="text-base text-gray-300">★</span>
                                    <span
                                      className="absolute top-0 left-0 text-base text-yellow-400 overflow-hidden"
                                      style={{ width: `${fillPercentage}%` }}
                                    >
                                      ★
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <span className="ml-1">({product.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  이전
                </Button>
                
                {/* 페이지 번호 */}
                <div className="flex space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index;
                    } else if (currentPage < 3) {
                      pageNum = index;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 5 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }

                                         return (
                       <Button
                         key={pageNum}
                         variant={currentPage === pageNum ? 'primary' : 'outline'}
                         onClick={() => handlePageChange(pageNum)}
                         className="w-10"
                       >
                         {pageNum + 1}
                       </Button>
                     );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 필터 모달 */}
      {showFilterModal && (
        <>
          {/* 모달 오버레이 */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowFilterModal(false)}
          />
          
          {/* 모달 컨텐츠 */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:w-96 md:max-w-md md:rounded-lg shadow-xl max-h-screen overflow-hidden">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">필터</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 모달 내용 */}
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                <div className="space-y-6">
                  {/* 정렬 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      정렬
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'latest', label: '최신순' },
                        { value: 'priceDesc', label: '가격 높은순' },
                        { value: 'priceAsc', label: '가격 낮은순' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={tempFilters.sortBy === option.value}
                            onChange={(e) => setTempFilters({...tempFilters, sortBy: e.target.value as ProductSortOption})}
                            className="mr-3 text-potato-600 focus:ring-potato-500"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 표시 개수 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      표시 개수
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 12, label: '12개' },
                        { value: 20, label: '20개' },
                        { value: 40, label: '40개' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="size"
                            value={option.value}
                            checked={tempFilters.size === option.value}
                            onChange={(e) => setTempFilters({...tempFilters, size: parseInt(e.target.value)})}
                            className="mr-3 text-potato-600 focus:ring-potato-500"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 가격 범위 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      가격 범위
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">최소 가격</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={tempFilters.minPrice || ''}
                          onChange={(e) => setTempFilters({
                            ...tempFilters, 
                            minPrice: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">최대 가격</label>
                        <Input
                          type="number"
                          placeholder="100000"
                          value={tempFilters.maxPrice || ''}
                          onChange={(e) => setTempFilters({
                            ...tempFilters, 
                            maxPrice: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 모달 하단 액션 버튼 */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTempFilters({
                        minPrice: undefined,
                        maxPrice: undefined,
                        sortBy: 'latest',
                        page: 0,
                        size: 20
                      });
                    }}
                    className="flex-1"
                  >
                    초기화
                  </Button>
                  <Button
                    onClick={() => {
                      const searchFilters = {
                        ...tempFilters,
                        page: 0
                      };
                      setFilters(searchFilters);
                      fetchProducts(searchFilters);
                      setShowFilterModal(false);
                    }}
                    className="flex-1"
                  >
                    적용
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 