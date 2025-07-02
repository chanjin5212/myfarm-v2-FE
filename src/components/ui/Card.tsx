import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

interface ProductCardProps {
  image?: string;
  title: string;
  price: number;
  originalPrice?: number;
  description?: string;
  badge?: string;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  description,
  badge,
  onAddToCart,
  onViewDetails,
  className = ''
}) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };
  
  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;
  
  return (
    <Card hover className={`overflow-hidden ${className}`} padding="none">
      <div className="relative">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover"
          />
        ) : (
                     <div className="w-full h-48 bg-gradient-to-br from-potato-100 to-potato-200 flex items-center justify-center">
             <div className="text-4xl">🥔</div>
           </div>
        )}
        
                 {badge && (
           <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
             {badge}
           </div>
         )}
        
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center space-x-2">
             <span className="text-xl font-bold text-potato-700">
               {formatPrice(price)}원
             </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}원
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
                    {onViewDetails && (
             <button
               onClick={onViewDetails}
               className="flex-1 px-3 py-2 border border-potato-300 text-potato-600 rounded-md hover:bg-potato-50 transition-colors text-sm font-medium"
             >
               상세보기
             </button>
           )}
           {onAddToCart && (
             <button
               onClick={onAddToCart}
               className="flex-1 px-3 py-2 bg-potato-300 text-gray-800 rounded-md hover:bg-potato-400 transition-colors text-sm font-medium"
             >
               장바구니
             </button>
           )}
        </div>
      </div>
    </Card>
  );
};

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string;
  content: string | React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, 
  title, 
  content, 
  className = '' 
}) => {
  return (
    <Card className={className}>
      <div className="flex items-start space-x-3">
                 {icon && (
           <div className="flex-shrink-0 w-8 h-8 bg-potato-100 rounded-full flex items-center justify-center text-potato-600">
             {icon}
           </div>
         )}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
          <div className="text-gray-600">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        </div>
      </div>
    </Card>
  );
};

const Cards = {
  Card,
  ProductCard,
  InfoCard
};

export default Cards; 