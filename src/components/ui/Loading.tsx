import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'potato' | 'green' | 'gray';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'potato' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colors = {
    potato: 'text-potato-400',
    green: 'text-green-500',
    gray: 'text-gray-400'
  };
  
  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = '로딩 중...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50' 
    : 'absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm';
    
  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', rows = 1 }) => {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded h-4 ${className}`}
        ></div>
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  showImage?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ showImage = true }) => {
  return (
    <div className="animate-pulse">
      {showImage && (
        <div className="bg-gray-200 h-48 w-full rounded-t-lg mb-4"></div>
      )}
      <div className="space-y-3 p-4">
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        <div className="bg-gray-200 h-8 rounded w-full"></div>
      </div>
    </div>
  );
};

const Loading = {
  Spinner: LoadingSpinner,
  Overlay: LoadingOverlay,
  Skeleton: Skeleton,
  CardSkeleton: CardSkeleton
};

export default Loading; 