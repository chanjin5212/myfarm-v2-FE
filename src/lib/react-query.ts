import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// React Query 기본 옵션 설정
const queryConfig: DefaultOptions = {
  queries: {
    // 쿼리 결과를 5분간 캐시
    staleTime: 5 * 60 * 1000, // 5 minutes
    // 백그라운드에서 자동 리페치 방지
    refetchOnWindowFocus: false,
    // 네트워크 재연결시 자동 리페치
    refetchOnReconnect: true,
    // 재시도 횟수
    retry: 3,
    // 재시도 지연 시간 (exponential backoff)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    // 뮤테이션 재시도 횟수
    retry: 1,
  },
};

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// 쿼리 키 상수들 (타입 안전성과 일관성을 위해)
export const queryKeys = {
  // 인증 관련
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  
  // 상품 관련
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
    categories: ['products', 'categories'] as const,
    popular: (limit?: number) => ['products', 'popular', limit] as const,
    new: (limit?: number) => ['products', 'new', limit] as const,
    discounted: (limit?: number) => ['products', 'discounted', limit] as const,
    recommended: (limit?: number) => ['products', 'recommended', limit] as const,
    related: (id: number, limit?: number) => ['products', 'related', id, limit] as const,
    search: (query: string, filters?: any) => ['products', 'search', query, filters] as const,
    reviews: (id: number, page?: number) => ['products', 'reviews', id, page] as const,
  },
  
  // 장바구니 관련
  cart: {
    all: ['cart'] as const,
    items: ['cart', 'items'] as const,
    count: ['cart', 'count'] as const,
  },
  
  // 주문 관련
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (page?: number, status?: string) => [...queryKeys.orders.lists(), page, status] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.orders.details(), id] as const,
    byNumber: (orderNumber: string) => ['orders', 'number', orderNumber] as const,
    stats: (period?: string) => ['orders', 'stats', period] as const,
    shipping: (id: number) => ['orders', 'shipping', id] as const,
  },
} as const;

// 쿼리 무효화 헬퍼 함수들
export const queryInvalidators = {
  // 인증 관련 쿼리 무효화
  invalidateAuth: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
  },
  
  // 상품 관련 쿼리 무효화
  invalidateProducts: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
  },
  
  invalidateProduct: (id: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.products.reviews(id) });
  },
  
  // 장바구니 관련 쿼리 무효화
  invalidateCart: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
  },
  
  // 주문 관련 쿼리 무효화
  invalidateOrders: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
  },
  
  invalidateOrder: (id: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
  },
  
  // 전체 캐시 초기화 (로그아웃시 사용)
  clearAllQueries: () => {
    queryClient.clear();
  },
}; 