// 상품 관련 타입 (백엔드 API 스펙에 맞춤)

// 상품 상태 enum
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

// 상품 이미지 정보
export interface ProductImageInfo {
  id: string; // UUID
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
}

// 상품 옵션 정보
export interface ProductOptionInfo {
  id: string; // UUID
  optionName: string;
  optionValue: string;
  additionalPrice: number;
  stock: number;
  isDefault: boolean;
}

// 상품 속성 정보
export interface ProductAttributeInfo {
  id: string; // UUID
  attributeName: string;
  attributeValue: string;
}

// 상품 상세 정보 (GetProduct.Response)
export interface Product {
  id: string; // UUID
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
  sellerId: string | null; // UUID
  categoryId: string; // UUID
  thumbnailUrl: string | null;
  origin: string | null;
  harvestDate: string | null; // LocalDate -> string
  storageMethod: string | null;
  isOrganic: boolean;
  orderCount: number;
  createdAt: string; // LocalDateTime -> string
  updatedAt: string; // LocalDateTime -> string
  images: ProductImageInfo[];
  options: ProductOptionInfo[];
  attributes: ProductAttributeInfo[];
  tags: string[];
}

// 상품 목록의 요약 정보 (ListProduct.ProductSummary)
export interface ProductSummary {
  id: string; // UUID
  name: string;
  price: number;
  thumbnailUrl: string | null;
  orderCount: number;
  createdAt: string; // LocalDateTime -> string
}

// 상품 목록 조회 요청 (ListProduct.Request)
export interface ProductListRequest {
  categoryId?: string; // UUID
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string; // 'latest', 'price', 'orderCount', etc.
  page?: number;
  size?: number;
}

// 상품 목록 조회 응답 (ListProduct.Response)
export interface ProductListResponse {
  totalCount: number;
  products: ProductSummary[];
}

// 상품 상세 조회 응답 (GetProduct.Response)
export interface ProductDetailResponse extends Product {}

// 레거시 필터 타입 (기존 코드 호환성을 위해 유지)
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
} 