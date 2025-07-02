import apiClient from '../api-client';
import {
  Product,
  ProductFilter,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

/**
 * 상품 관련 API 서비스
 */
export const productService = {
  /**
   * 상품 목록 조회 (페이지네이션)
   */
  getProducts: async (
    page: number = 1,
    limit: number = 12,
    filters?: ProductFilter
  ): Promise<PaginatedResponse<Product[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }

    const response = await apiClient.get<PaginatedResponse<Product[]>>(`/products?${params}`);
    return response.data;
  },

  /**
   * 상품 상세 조회
   */
  getProduct: async (productId: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`);
    return response.data.data;
  },

  /**
   * 인기 상품 조회
   */
  getPopularProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/popular?limit=${limit}`);
    return response.data.data;
  },

  /**
   * 신상품 조회
   */
  getNewProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/new?limit=${limit}`);
    return response.data.data;
  },

  /**
   * 할인 상품 조회
   */
  getDiscountedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/discounted?limit=${limit}`);
    return response.data.data;
  },

  /**
   * 카테고리별 상품 조회
   */
  getProductsByCategory: async (
    category: string,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Product[]>> => {
    const response = await apiClient.get<PaginatedResponse<Product[]>>(
      `/products/category/${category}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * 상품 검색
   */
  searchProducts: async (
    query: string,
    page: number = 1,
    limit: number = 12,
    filters?: Omit<ProductFilter, 'search'>
  ): Promise<PaginatedResponse<Product[]>> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }

    const response = await apiClient.get<PaginatedResponse<Product[]>>(`/products/search?${params}`);
    return response.data;
  },

  /**
   * 추천 상품 조회 (로그인 사용자 기반)
   */
  getRecommendedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/recommended?limit=${limit}`);
    return response.data.data;
  },

  /**
   * 연관 상품 조회
   */
  getRelatedProducts: async (productId: number, limit: number = 4): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/${productId}/related?limit=${limit}`
    );
    return response.data.data;
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>('/products/categories');
    return response.data.data;
  },

  /**
   * 상품 리뷰 조회
   */
  getProductReviews: async (
    productId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any[]>> => {
    const response = await apiClient.get<PaginatedResponse<any[]>>(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * 상품 리뷰 작성
   */
  createProductReview: async (
    productId: number,
    reviewData: {
      rating: number;
      comment: string;
      images?: string[];
    }
  ): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/products/${productId}/reviews`,
      reviewData
    );
    return response.data.data;
  },
}; 