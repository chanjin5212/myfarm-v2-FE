'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { authService } from '@/lib/services/auth';
import { MeResponse } from '@/types/api';

export default function ProfilePage() {
  const { success, error: showError, info } = useToast();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [showError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: 백엔드에 사용자 정보 업데이트 API 구현되면 연결
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/mypage" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            마이페이지로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">내정보</h1>
          <p className="mt-2 text-gray-600">개인정보를 확인하고 수정할 수 있습니다.</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 이미지 */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">프로필 이미지</h2>
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>
              
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">주소 정보</h2>
              
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h2>
              
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
        </Card>
      </div>
    </div>
  );
} 