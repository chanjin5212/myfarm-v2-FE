'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/services/products';
import { Product, ProductStatus } from '@/types/product';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 상품 상세 정보 조회
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await productService.getProduct(resolvedParams.id);
        setProduct(productData);
        
        // 기본 옵션 설정
        if (productData.options.length > 0) {
          const defaultOption = productData.options.find(opt => opt.isDefault);
          setSelectedOption(defaultOption?.id || productData.options[0].id);
        }
      } catch (err) {
        console.error('상품 조회 실패:', err);
        setError('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // 상품 상태 표시
  const getStatusBadge = (status: ProductStatus) => {
    const statusMap = {
      [ProductStatus.ACTIVE]: { text: '판매중', color: 'bg-green-100 text-green-800' },
      [ProductStatus.INACTIVE]: { text: '판매중지', color: 'bg-gray-100 text-gray-800' },
      [ProductStatus.OUT_OF_STOCK]: { text: '품절', color: 'bg-red-100 text-red-800' },
      [ProductStatus.DISCONTINUED]: { text: '단종', color: 'bg-red-100 text-red-800' },
    };
    
    const badge = statusMap[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // 선택된 옵션 정보 가져오기
  const getSelectedOptionInfo = () => {
    if (!product || !selectedOption) return null;
    return product.options.find(opt => opt.id === selectedOption);
  };

  // 최종 가격 계산
  const getFinalPrice = () => {
    if (!product) return 0;
    const optionInfo = getSelectedOptionInfo();
    return product.price + (optionInfo?.additionalPrice || 0);
  };

  // 장바구니 추가
  const handleAddToCart = () => {
    // TODO: 장바구니 기능 구현
    alert('장바구니 기능은 추후 구현 예정입니다.');
  };

  // 바로 구매
  const handleBuyNow = () => {
    // TODO: 주문 기능 구현
    alert('주문 기능은 추후 구현 예정입니다.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-potato-500 mx-auto mb-4"></div>
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">상품을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">{error || '요청하신 상품이 존재하지 않습니다.'}</p>
          <Button onClick={() => router.push('/products')}>
            상품 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 표시할 이미지 목록 (썸네일 포함)
  const displayImages = product.images.length > 0 
    ? product.images.sort((a, b) => a.sortOrder - b.sortOrder)
    : product.thumbnailUrl 
    ? [{ id: 'thumbnail', imageUrl: product.thumbnailUrl, isThumbnail: true, sortOrder: 0 }]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            ← 뒤로가기
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 상품 이미지 */}
          <div>
            {/* 메인 이미지 */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {displayImages.length > 0 ? (
                <img
                  src={displayImages[selectedImageIndex].imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* 이미지 썸네일 */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex 
                        ? 'border-potato-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div>
            <Card className="p-6">
              {/* 상품명 및 상태 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  {getStatusBadge(product.status)}
                </div>
                {product.isOrganic && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    유기농
                  </span>
                )}
              </div>

              {/* 가격 */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-potato-600 mb-1">
                  {formatPrice(getFinalPrice())}원
                </div>
                {getSelectedOptionInfo()?.additionalPrice !== 0 && (
                  <div className="text-sm text-gray-500">
                    기본가격: {formatPrice(product.price)}원
                    {getSelectedOptionInfo()?.additionalPrice && (
                      <span> + 옵션: {formatPrice(getSelectedOptionInfo()!.additionalPrice)}원</span>
                    )}
                  </div>
                )}
              </div>

              {/* 기본 정보 */}
              <div className="space-y-3 mb-6">
                {product.origin && (
                  <div className="flex">
                    <span className="text-gray-600 w-20">원산지:</span>
                    <span className="font-medium">{product.origin}</span>
                  </div>
                )}
                {product.harvestDate && (
                  <div className="flex">
                    <span className="text-gray-600 w-20">수확일:</span>
                    <span className="font-medium">{formatDate(product.harvestDate)}</span>
                  </div>
                )}
                {product.storageMethod && (
                  <div className="flex">
                    <span className="text-gray-600 w-20">보관방법:</span>
                    <span className="font-medium">{product.storageMethod}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="text-gray-600 w-20">주문수:</span>
                  <span className="font-medium">{product.orderCount}회</span>
                </div>
              </div>

              {/* 옵션 선택 */}
              {product.options.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    옵션 선택
                  </label>
                  <select
                    value={selectedOption || ''}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-potato-500 focus:border-potato-500"
                  >
                    {product.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.optionName}: {option.optionValue}
                        {option.additionalPrice > 0 && ` (+${formatPrice(option.additionalPrice)}원)`}
                        {option.stock <= 0 && ' (품절)'}
                      </option>
                    ))}
                  </select>
                  {getSelectedOptionInfo() && (
                    <div className="mt-2 text-sm text-gray-600">
                      재고: {getSelectedOptionInfo()!.stock}개
                    </div>
                  )}
                </div>
              )}

              {/* 수량 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  수량
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 구매 버튼 */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full"
                  disabled={product.status !== ProductStatus.ACTIVE || 
                           (getSelectedOptionInfo()?.stock || 0) <= 0}
                >
                  장바구니 담기
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="w-full"
                  disabled={product.status !== ProductStatus.ACTIVE || 
                           (getSelectedOptionInfo()?.stock || 0) <= 0}
                >
                  바로 구매
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* 상품 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 상품 설명 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">상품 설명</h2>
              {product.description ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                </div>
              ) : (
                <p className="text-gray-500">상품 설명이 없습니다.</p>
              )}
            </Card>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-6">
            {/* 상품 속성 */}
            {product.attributes.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">상품 속성</h3>
                <div className="space-y-2">
                  {product.attributes.map((attribute) => (
                    <div key={attribute.id} className="flex justify-between">
                      <span className="text-gray-600">{attribute.attributeName}:</span>
                      <span className="font-medium">{attribute.attributeValue}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 태그 */}
            {product.tags.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-potato-100 text-potato-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* 기타 정보 */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">상품 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">등록일:</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">수정일:</span>
                  <span>{formatDate(product.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 ID:</span>
                  <span className="text-xs text-gray-500">{product.id}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 