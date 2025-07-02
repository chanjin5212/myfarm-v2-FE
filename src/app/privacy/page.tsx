import React from 'react';

export default function PrivacyPage() {

  return (
    <div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">개인정보처리방침</h1>
          
          <div className="prose max-w-none text-gray-800 leading-relaxed">
            <p className="mb-8">
              (주)강원찐농부(이하 "회사"라 함)은 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 준수하고 있습니다. 회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. 수집하는 개인정보의 항목 및 수집방법</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-3">가. 수집하는 개인정보의 항목</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>회원가입 시:</strong> 이름, 아이디, 비밀번호, 이메일 주소, 휴대폰 번호, 생년월일</li>
              <li><strong>주문/결제 시:</strong> 배송지 정보(수령인, 주소, 연락처), 결제 정보</li>
              <li><strong>자동 수집 항목:</strong> IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
            </ul>

            <h3 className="text-lg font-medium mt-6 mb-3">나. 개인정보 수집방법</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>홈페이지 회원가입, 상품 구매, 고객센터, 이벤트 응모</li>
              <li>생성정보 수집 툴을 통한 자동 수집</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. 개인정보의 수집 및 이용목적</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지, 가입의사 확인, 불만처리 등 민원처리, 고지사항 전달</li>
              <li><strong>서비스 제공:</strong> 상품 배송, 주문 및 결제 처리, 신규 서비스 개발 및 맞춤 서비스 제공</li>
              <li><strong>마케팅 및 광고에의 활용:</strong> 이벤트 및 광고성 정보 제공, 서비스의 유효성 확인, 접속빈도 파악, 회원의 서비스 이용에 대한 통계</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <p className="mb-4">
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래등에서의 소비자 보호에 관한 법률)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래등에서의 소비자 보호에 관한 법률)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래등에서의 소비자 보호에 관한 법률)</li>
              <li>로그인 기록: 3개월 (통신비밀보호법)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. 개인정보의 파기절차 및 방법</h2>
            <p className="mb-4">
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">가. 파기절차</h3>
            <p className="mb-4">
              회원이 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">나. 파기방법</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
              <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. 개인정보 제공 및 공유</h2>
            <p className="mb-4">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              <li>통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 가공하여 제공하는 경우</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. 이용자 및 법정대리인의 권리와 그 행사방법</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원탈퇴를 통해 개인정보 이용에 대한 동의를 철회할 수 있습니다.</li>
              <li>이용자의 개인정보 조회 및 수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을, 가입해지(동의철회)를 위해서는 '회원탈퇴'를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.</li>
              <li>만 14세 미만 아동의 경우, 법정대리인이 아동의 개인정보를 조회하거나 수정할 권리, 동의 철회할 권리를 가집니다.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</h2>
            <p className="mb-4">
              회사는 이용자의 정보를 수시로 저장하고 찾아내는 '쿠키(cookie)' 등을 운용합니다. 쿠키란 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일로서 이용자의 컴퓨터 하드디스크에 저장됩니다.
            </p>
            <p className="mb-4">
              이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. 개인정보의 기술적/관리적 보호 대책</h2>
            <p className="mb-4">
              회사는 이용자의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>비밀번호 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보보호 전담 조직 운영</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. 개인정보 관리책임자 및 담당자의 연락처</h2>
            <p className="mb-4">
              귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-medium mb-3">개인정보 관리책임자</h3>
              <ul className="space-y-1">
                <li><strong>이름:</strong> 이숙경</li>
                <li><strong>이메일:</strong> <a href="mailto:oho1114@naver.com" className="text-potato-600 hover:underline">oho1114@naver.com</a></li>
                <li><strong>전화번호:</strong> 010-8775-5212</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. 고지의 의무</h2>
            <p className="mb-4">
              현 개인정보처리방침 내용 추가, 삭제 및 수정이 있을 시에는 시행일자 최소 7일 전부터 홈페이지의 공지사항을 통하여 고지할 것입니다.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-lg font-medium text-gray-700">시행일: 2025년 5월 1일</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 