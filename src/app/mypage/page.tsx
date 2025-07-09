'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/auth';
import { MeResponse } from '@/types/api';

export default function MyPage() {
  const { success, error: showError, info } = useToast();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    loginId: '',
    name: '',
    nickname: '',
    phone: '',
    address: '',
    detailAddress: '',
    postalCode: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setFormData({
          email: userData.email,
          loginId: userData.login_id,
          name: userData.name,
          nickname: userData.nickname || '',
          phone: userData.phone_number,
          address: userData.address || '',
          detailAddress: userData.detail_address || '',
          postalCode: userData.postcode || '',
        });
      } catch (error) {
        console.error('사용자 정보 조회 에러:', error);
        showError('사용자 정보를 불러올 수 없습니다.');
        // 인증 실패 시 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [showError]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      success('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 에러:', error);
      showError('로그아웃에 실패했습니다.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    info('사용자 정보 수정 기능은 준비 중입니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        email: user.email,
        loginId: user.login_id,
        name: user.name,
        nickname: user.nickname || '',
        phone: user.phone_number,
        address: user.address || '',
        detailAddress: user.detail_address || '',
        postalCode: user.postcode || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">사용자 정보 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">사용자 정보를 불러올 수 없습니다.</p>
          <Link href="/login" className="mt-4 inline-block">
            <Button>로그인하러 가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 이미지 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">프로필 이미지</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="프로필 이미지"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => info('프로필 이미지 변경 기능은 준비 중입니다.')}
                    >
                      이미지 변경
                    </Button>
                    <p className="mt-1 text-sm text-gray-500">
                      JPG, PNG 파일만 업로드 가능합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1"
                      disabled={!isEditing}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      이메일 변경은 고객센터에 문의해주세요.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
                      로그인 ID
                    </label>
                    <Input
                      id="loginId"
                      name="loginId"
                      type="text"
                      value={formData.loginId}
                      className="mt-1 bg-gray-50"
                      disabled={true}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      로그인 ID는 변경할 수 없습니다.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="이름을 입력하세요"
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                      닉네임
                    </label>
                    <Input
                      id="nickname"
                      name="nickname"
                      type="text"
                      value={formData.nickname}
                      onChange={handleChange}
                      placeholder="닉네임을 입력하세요"
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      전화번호
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* 주소 정보 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">주소 정보</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      우편번호
                    </label>
                    <div className="mt-1 flex space-x-2">
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="우편번호"
                        className="flex-1"
                        disabled={!isEditing}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!isEditing}
                        onClick={() => info('주소 검색 기능은 준비 중입니다.')}
                      >
                        주소찾기
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      주소
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="주소"
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">
                      상세주소
                    </label>
                    <Input
                      id="detailAddress"
                      name="detailAddress"
                      type="text"
                      value={formData.detailAddress}
                      onChange={handleChange}
                      placeholder="상세주소를 입력하세요"
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* 계정 정보 */}
              <div className="pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">가입일</p>
                      <p className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">마지막 로그인</p>
                      <p className="text-sm text-gray-600">
                        {user.last_login ? new Date(user.last_login).toLocaleString('ko-KR') : '정보 없음'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">이용약관 동의</p>
                      <p className="text-sm text-gray-600">
                        {user.terms_agreed ? '동의함' : '동의하지 않음'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">마케팅 정보 수신</p>
                      <p className="text-sm text-gray-600">
                        {user.marketing_agreed ? '동의함' : '동의하지 않음'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => info('비밀번호 변경 기능은 준비 중입니다.')}
                    >
                      비밀번호 변경
                    </Button>
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      취소
                    </Button>
                    <Button type="submit">
                      저장
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    수정
                  </Button>
                )}
              </div>
            </form>
          </div>
        );
      case 'shipping':
        return (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">배송지 관리</h3>
            <p className="mt-1 text-sm text-gray-500">배송지 관리 기능은 준비 중입니다.</p>
          </div>
        );
      case 'orders':
        return (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">주문내역</h3>
            <p className="mt-1 text-sm text-gray-500">주문내역 기능은 준비 중입니다.</p>
          </div>
        );
      case 'reviews':
        return (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">리뷰관리</h3>
            <p className="mt-1 text-sm text-gray-500">리뷰관리 기능은 준비 중입니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 사용자 정보 */}
        <div className="bg-white shadow-sm">
          <div className="py-6 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="프로필 이미지"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    안녕하세요, {user.name || user.email}님!
                  </h1>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href="/">
                  <Button variant="outline" size="sm">홈으로</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-4 sm:px-6">
              {[
                { id: 'profile', label: '내정보', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'shipping', label: '배송지 관리', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
                { id: 'orders', label: '주문내역', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                { id: 'reviews', label: '리뷰관리', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="bg-white shadow-sm">
          <div className="py-6 px-4 sm:px-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 