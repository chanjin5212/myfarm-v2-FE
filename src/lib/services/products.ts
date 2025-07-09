import apiClient from '../api-client';
import {
  Product,
  ProductSummary,
  ProductListRequest,
  ProductListResponse,
  ProductDetailResponse,
} from '@/types/product';

/**
 * 상품 관련 API 서비스 (백엔드 API 스펙에 맞춤)
 */
export const productService = {
  /**
   * 상품 목록 조회
   * GET /api/products/v1
   */
  getProducts: async (params: ProductListRequest = {}): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams();

    // 쿼리 파라미터 설정
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const queryString = searchParams.toString();
    const url = `/products/v1${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<any>(url);
    
    // 여러 가지 응답 패턴 처리
    let data = response.data;
    
    // 만약 data 안에 data가 있다면 (래퍼가 있는 경우)
    if (data && data.data && typeof data.data === 'object') {
      data = data.data;
    }
    
    const totalCount = data?.totalCount || data?.total_count || data?.total || 0;
    const products = data?.products || data?.items || [];
    
    return {
      totalCount,
      products
    };
  },

  /**
   * 상품 상세 조회
   * GET /api/products/v1/{id}
   */
  getProduct: async (productId: string): Promise<ProductDetailResponse> => {
    const response = await apiClient.get<ProductDetailResponse>(`/products/v1/${productId}`);
    
    // 응답 데이터의 기본값 설정
    const data = response.data;
    return {
      ...data,
      images: data?.images || [],
      options: data?.options || [],
      attributes: data?.attributes || [],
      tags: data?.tags || [],
      orderCount: data?.orderCount || 0,
    };
  },

  /**
   * 카테고리별 상품 조회 (편의 함수)
   */
  getProductsByCategory: async (
    categoryId: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'latest'
  ): Promise<ProductListResponse> => {
    return await productService.getProducts({
      categoryId,
      page,
      size,
      sortBy,
    });
  },

  /**
   * 상품 검색 (편의 함수)
   */
  searchProducts: async (
    keyword: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'latest'
  ): Promise<ProductListResponse> => {
    return await productService.getProducts({
      keyword,
      page,
      size,
      sortBy,
    });
  },

  /**
   * 가격 범위로 상품 조회 (편의 함수)
   */
  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'latest'
  ): Promise<ProductListResponse> => {
    return await productService.getProducts({
      minPrice,
      maxPrice,
      page,
      size,
      sortBy,
    });
  },

  /**
   * 인기 상품 조회 (주문수 기준 정렬)
   */
  getPopularProducts: async (size: number = 8): Promise<ProductListResponse> => {
    return await productService.getProducts({
      sortBy: 'orderCount',
      size,
      page: 0,
    });
  },

  /**
   * 신상품 조회 (최신순 정렬)
   */
  getNewProducts: async (size: number = 8): Promise<ProductListResponse> => {
    return await productService.getProducts({
      sortBy: 'latest',
      size,
      page: 0,
    });
  },
}; 