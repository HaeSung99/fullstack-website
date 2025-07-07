"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface SportsClass {
  id: number;
  title: string;
  sport: string;
  instructor: string;
  schedule: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  type: 'REGULAR' | 'PRIVATE' | 'GROUP';
  description: string;
  image: string | null;
  location: string;
  ageGroup: string;
  status: 'RECRUITING' | 'FULL' | 'SUSPENDED' | 'UPCOMING';
  createdAt: string;
  updatedAt: string;
}

interface ClassEnrollmentForm {
  classId: number;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  experience: string;
  message: string;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// 신청 완료 모달 컴포넌트
function EnrollmentSuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">신청이 접수되었습니다</h3>
          <p className="text-gray-600 mb-6">
            추후 문자나 전화를 통해<br />
            연락드릴 예정입니다
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClassDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [sportsClass, setSportsClass] = useState<SportsClass | null>(null);
  const [enrollmentForm, setEnrollmentForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: 0,
    gender: '',
    experience: '초보자',
    message: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [enrollmentError, setEnrollmentError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSportsClass = async () => {
      try {
        const { data } = await api.get(`/user/sports-class/${id}`);
        setSportsClass(data);
      } catch (error) {
        console.error('스포츠 클래스 상세 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchSportsClass();
  }, [id]);

  if (!sportsClass) return <div>로딩 중...</div>;

  function formatPhone(value: string) {
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8) return onlyNums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const prev = enrollmentForm.phone;
    if (raw.length < prev.length && prev[raw.length] === '-') {
      setEnrollmentForm({ ...enrollmentForm, phone: prev.slice(0, -1) });
      return;
    }
    setEnrollmentForm({ ...enrollmentForm, phone: formatPhone(raw) });
  }

  function handleEmergencyPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const prev = enrollmentForm.emergencyPhone;
    if (raw.length < prev.length && prev[raw.length] === '-') {
      setEnrollmentForm({ ...enrollmentForm, emergencyPhone: prev.slice(0, -1) });
      return;
    }
    setEnrollmentForm({ ...enrollmentForm, emergencyPhone: formatPhone(raw) });
  }

  function isValidEmail(email: string) {
    return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  async function handleEnrollmentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnrollmentError('');
    
    if (enrollmentForm.name.length > 10) {
      setEnrollmentError('이름은 10글자 이내로 입력해 주세요.');
      return;
    }
    if (enrollmentForm.phone.replace(/[^0-9]/g, '').length < 10) {
      setEnrollmentError('전화번호를 올바르게 입력해 주세요.');
      return;
    }
    if (enrollmentForm.email && !isValidEmail(enrollmentForm.email)) {
      setEnrollmentError('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (enrollmentForm.age < 5 || enrollmentForm.age > 100) {
      setEnrollmentError('나이를 올바르게 입력해 주세요.');
      return;
    }
    if (!enrollmentForm.gender) {
      setEnrollmentError('성별을 선택해 주세요.');
      return;
    }
    if (enrollmentForm.message.length > 200) {
      setEnrollmentError('특별 요청사항은 200자 이내로 입력해 주세요.');
      return;
    }

    try {
      const submitData = {
        ...enrollmentForm,
        classId: Number(id),
      };
      await api.post('/user/sports-class/enroll', submitData);
      setShowSuccessModal(true);
      setEnrollmentForm({
        name: '',
        phone: '',
        email: '',
        age: 0,
        gender: '',
        experience: '초보자',
        message: '',
        medicalConditions: '',
        emergencyContact: '',
        emergencyPhone: '',
      });
    } catch (error) {
      console.error('수강 신청 중 오류가 발생했습니다:', error);
      setEnrollmentError('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return '초급';
      case 'INTERMEDIATE': return '중급';
      case 'ADVANCED': return '고급';
      default: return level;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'REGULAR': return '정기반';
      case 'PRIVATE': return '개인레슨';
      case 'GROUP': return '소그룹';
      default: return type;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RECRUITING': return '모집중';
      case 'FULL': return '정원마감';
      case 'UPCOMING': return '개강예정';
      case 'SUSPENDED': return '모집중지';
      default: return status;
    }
  };

  return (
    <main className="mt-[80px]">
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 좌측: 클래스 상세 정보 */}
          <div className="flex-1 min-w-[480px] basis-[600px] bg-white rounded-lg shadow overflow-hidden">
            {sportsClass.image && (
              <div className="w-full flex justify-center items-center bg-gray-100" style={{ minHeight: 270 }}>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${sportsClass.image}`}
                  alt={sportsClass.title}
                  className="object-cover rounded-lg max-w-xl w-full h-auto max-h-[360px]"
                  style={{ maxWidth: 480, maxHeight: 360 }}
                />
              </div>
            )}
            <div className="p-10">
              <h1 className="text-3xl font-bold mb-4">{sportsClass.title}</h1>
              <div className="space-y-4 text-gray-600">
                <p><span className="font-medium">종목:</span> {sportsClass.sport}</p>
                <p><span className="font-medium">강사:</span> {sportsClass.instructor}</p>
                <p><span className="font-medium">일정:</span> {sportsClass.schedule}</p>
                <p><span className="font-medium">기간:</span> {sportsClass.startDate} ~ {sportsClass.endDate}</p>
                <p><span className="font-medium">수강료:</span> {sportsClass.price.toLocaleString()}원</p>
                <p><span className="font-medium">레벨:</span> {getLevelText(sportsClass.level)}</p>
                <p><span className="font-medium">수업형태:</span> {getTypeText(sportsClass.type)}</p>
                <p><span className="font-medium">모집인원:</span> {sportsClass.currentParticipants}/{sportsClass.maxParticipants}명</p>
                <p><span className="font-medium">위치:</span> {sportsClass.location}</p>
                <p><span className="font-medium">연령대:</span> {sportsClass.ageGroup}</p>
                <p className={`font-medium ${
                  sportsClass.status === 'RECRUITING' ? 'text-green-600' :
                  sportsClass.status === 'FULL' ? 'text-red-600' :
                  sportsClass.status === 'UPCOMING' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  상태: {getStatusText(sportsClass.status)}
                </p>
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">클래스 소개</h2>
                  <p className="whitespace-pre-wrap">{sportsClass.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 우측: 수강 신청 폼 */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h2 className="text-xl font-bold mb-4 text-blue-700">수강 신청</h2>
              
              {/* 상태에 따른 안내 메시지 */}
              {sportsClass.status === 'UPCOMING' && (
                <div className="mb-4 text-blue-600 font-semibold">개강 예정입니다. 곧 모집이 시작됩니다.</div>
              )}
              {sportsClass.status === 'FULL' && (
                <div className="mb-4 text-red-600 font-semibold">정원이 마감되어 신청하실 수 없습니다.</div>
              )}
              {sportsClass.status === 'RECRUITING' && (
                <div className="mb-4 text-green-600 font-semibold">현재 모집중입니다. 아래 폼을 작성해 신청해 주세요.</div>
              )}
              {sportsClass.status === 'SUSPENDED' && (
                <div className="mb-4 text-yellow-600 font-semibold">모집이 일시 중지되었습니다. 신청이 불가합니다.</div>
              )}

              <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">이름 *</label>
                  <input
                    type="text"
                    value={enrollmentForm.name}
                    maxLength={10}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, name: e.target.value.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '').slice(0, 10) })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    required
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                  <div className="text-xs text-gray-400 text-right">{enrollmentForm.name.length}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-medium">전화번호 *</label>
                  <input
                    type="text"
                    value={enrollmentForm.phone}
                    onChange={handlePhoneChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    placeholder="010-1234-5678"
                    required
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">이메일 *</label>
                  <input
                    type="email"
                    value={enrollmentForm.email}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, email: e.target.value })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    required
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">나이 *</label>
                  <input
                    type="number"
                    value={enrollmentForm.age || ''}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, age: Number(e.target.value) })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    min="5"
                    max="100"
                    required
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">성별 *</label>
                  <select
                    value={enrollmentForm.gender}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, gender: e.target.value })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    required
                    disabled={sportsClass.status !== 'RECRUITING'}
                  >
                    <option value="">성별을 선택해주세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">경험 수준</label>
                  <select
                    value={enrollmentForm.experience}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, experience: e.target.value })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    disabled={sportsClass.status !== 'RECRUITING'}
                  >
                    <option value="초보자">초보자</option>
                    <option value="경험자">경험자</option>
                    <option value="숙련자">숙련자</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">비상연락처 (선택)</label>
                  <input
                    type="text"
                    value={enrollmentForm.emergencyContact}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, emergencyContact: e.target.value.slice(0, 10) })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    placeholder="비상연락처 이름"
                    maxLength={10}
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">비상연락처 전화번호 (선택)</label>
                  <input
                    type="text"
                    value={enrollmentForm.emergencyPhone}
                    onChange={handleEmergencyPhoneChange}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    placeholder="010-1234-5678"
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">건강상 주의사항 (선택)</label>
                  <textarea
                    value={enrollmentForm.medicalConditions}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, medicalConditions: e.target.value.slice(0, 100) })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    rows={3}
                    placeholder="알레르기, 부상 이력 등"
                    maxLength={100}
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                  <div className="text-xs text-gray-400 text-right">{enrollmentForm.medicalConditions.length}/100</div>
                </div>

                <div>
                  <label className="block text-sm font-medium">특별 요청사항 (선택)</label>
                  <textarea
                    value={enrollmentForm.message}
                    onChange={e => setEnrollmentForm({ ...enrollmentForm, message: e.target.value.slice(0, 200) })}
                    className="mt-1 block w-full border rounded px-2 py-1"
                    rows={3}
                    placeholder="강사님께 전달하고 싶은 내용"
                    maxLength={200}
                    disabled={sportsClass.status !== 'RECRUITING'}
                  />
                  <div className="text-xs text-gray-400 text-right">{enrollmentForm.message.length}/200</div>
                </div>

                {enrollmentError && (
                  <div className="text-red-600 text-sm">{enrollmentError}</div>
                )}

                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded font-medium ${
                    sportsClass.status === 'RECRUITING'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={sportsClass.status !== 'RECRUITING'}
                >
                  {sportsClass.status === 'RECRUITING' ? '수강 신청하기' : '신청 불가'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* 신청 완료 모달 */}
      <EnrollmentSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
    </main>
  );
}
