"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from "next/navigation";

const api = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string | null;
  order: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface Manager {
  id: number;
  user_id: string;
  name: string;
  role: string;
}

interface Contact {
  id: number;
  name: string;
  company: string;
  identity: string;
  position: string;
  phone: string;
  email: string;
  type: string;
  message: string;
  contactMethod: string;
  status: '미처리' | '처리중' | '처리완료';
  memo: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassEnrollment {
  id: number;
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
  status: string;
  enrollmentDate: string;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('notices');
  const [showSportsClassForm, setShowSportsClassForm] = useState(false);
  const [editingSportsClass, setEditingSportsClass] = useState<SportsClass | null>(null);
  const [sportsClassForm, setSportsClassForm] = useState({
    title: '',
    sport: '',
    instructor: '',
    schedule: '',
    startDate: '',
    endDate: '',
    maxParticipants: 0,
    price: 0,
    level: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    type: 'REGULAR' as 'REGULAR' | 'PRIVATE' | 'GROUP',
    description: '',
    image: null as File | null,
    imageUrl: null as string | null,
    location: '',
    ageGroup: '',
    status: 'RECRUITING' as 'RECRUITING' | 'FULL' | 'SUSPENDED' | 'UPCOMING'
  });
  const [sportsClassList, setSportsClassList] = useState<SportsClass[]>([]);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
  });
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    image: null as File | null,
    imageUrl: null as string | null,
    description: '',
  });
  const [isReordering, setIsReordering] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [managerForm, setManagerForm] = useState({ user_id: '', password: '', name: '', role: '' });
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contactMemo, setContactMemo] = useState<{[id:number]: string}>({});
  const [contactStatus, setContactStatus] = useState<{[id:number]: string}>({});
  const [showMemoModal, setShowMemoModal] = useState<{open: boolean, id: number | null}>({open: false, id: null});
  const [showMessageModal, setShowMessageModal] = useState<{open: boolean, content: string}>({open: false, content: ''});
  const [showClassEnrollments, setShowClassEnrollments] = useState(false);
  const [selectedSportsClass, setSelectedSportsClass] = useState<SportsClass | null>(null);
  const [enrollmentList, setEnrollmentList] = useState<ClassEnrollment[]>([]);
  const [showEnrollmentDetailModal, setShowEnrollmentDetailModal] = useState<{open: boolean, enrollment: ClassEnrollment | null}>({open: false, enrollment: null});
  const memoInputRef = useRef<HTMLTextAreaElement>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const router = useRouter();

  // 공지사항 목록 가져오기
  const fetchNoticeList = async () => {
    try {
      const { data } = await api.get('/admin/notice');
      setNoticeList(data);
    } catch (error) {
      console.error('공지사항 목록을 가져오는데 실패했습니다:', error);
    }
  };

  // 공지사항 등록
  const handleNoticeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/admin/notice', noticeForm);
      fetchNoticeList();
      setNoticeForm({ title: '', content: '' });
      setShowNoticeForm(false);
    } catch (error) {
      console.error('공지사항 등록에 실패했습니다:', error);
    }
  };

  // 공지사항 수정
  const handleEditNotice = async (id: number) => {
    try {
      await api.put(`/admin/notice/${id}`, noticeForm);
      fetchNoticeList();
      setEditingNotice(null);
      setNoticeForm({ title: '', content: '' });
    } catch (error) {
      console.error('공지사항 수정에 실패했습니다:', error);
    }
  };

  // 공지사항 삭제
  const handleDeleteNotice = async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await api.delete(`/admin/notice/${id}`);
        fetchNoticeList();
      } catch (error) {
        console.error('공지사항 삭제에 실패했습니다:', error);
      }
    }
  };

  // 팀원 목록 가져오기
  const fetchTeamList = async () => {
    try {
      const { data } = await api.get('/admin/team');
      setTeamList(data.sort((a: TeamMember, b: TeamMember) => a.order - b.order));
    } catch (error) {
      console.error('팀원 목록을 가져오는데 실패했습니다:', error);
    }
  };

  const handleDragEnd = async (event: any) => {
    if (isReordering) return; // 중복 방지
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setIsReordering(true);
    const oldIndex = teamList.findIndex((m) => m.id === active.id);
    const newIndex = teamList.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(teamList, oldIndex, newIndex);
    const newOrderList = reordered.map((member, idx) => ({
      id: member.id,
      order: idx + 1,
      version: member.version,
    }));

    try {
      await api.patch('/admin/team/reorder', newOrderList);
    } catch (error) {
      alert('동시 수정 충돌이 발생했습니다. 새로고침 후 다시 시도해 주세요.');
    } finally {
      await fetchTeamList(); // 항상 최신 데이터로 동기화
      setIsReordering(false);
    }
  };

  function SortableItem({ member }: { member: TeamMember }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: member.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border rounded-lg p-4 flex justify-between items-center bg-white mb-2">
        <div className="flex items-center gap-4">
          {member.image && (
            <img src={`/api${member.image}`} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
          )}
          <div>
            <div className="font-bold">{member.name}</div>
            <div className="text-sm text-gray-500">{member.role}</div>
          </div>
        </div>
      </div>
    );
  }

  // 팀원 등록/수정
  const handleTeamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', teamForm.name);
    formData.append('role', teamForm.role);
    formData.append('description', teamForm.description);
    if (teamForm.image) {
      formData.append('image', teamForm.image);
    } else if (editingTeam && teamForm.imageUrl) {
      formData.append('image', teamForm.imageUrl);
    }
    if (editingTeam) {
      await api.put(`/admin/team/${editingTeam.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await api.post('/admin/team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    setShowTeamForm(false);
    setEditingTeam(null);
    setTeamForm({ name: '', role: '', image: null, imageUrl: null, description: '' });
    fetchTeamList();
  };

  // 팀원 삭제
  const handleDeleteTeam = async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await api.delete(`/admin/team/${id}`);
        fetchTeamList();
      } catch (error) {
        console.error('팀원 삭제에 실패했습니다:', error);
      }
    }
  };

  // 인증 체크
  useEffect(() => {
    let requested = false;
    if (!requested) {
      requested = true;
      api.get('/auth/me', { withCredentials: true })
        .then(() => setLoading(false))
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            router.push('/admin/login');
          }
        });
    }
  }, []);

  // 탭 변경 시 목록 가져오기 (인증 체크 후에만 동작)
  useEffect(() => {
    if (loading) return;
    if (activeTab === 'notices') {
      fetchNoticeList();
    } else if (activeTab === 'sports-class') {
      fetchSportsClassList();
    } else if (activeTab === 'team') {
      fetchTeamList();
    } else if (activeTab === 'managers') {
      fetchManagers();
    } else if (activeTab === 'contact') {
      fetchContactList();
    }
  }, [activeTab, loading]);

  // 스포츠 클래스 목록 가져오기
  const fetchSportsClassList = async () => {
    try {
      const { data } = await api.get('/admin/sports-class');
      setSportsClassList(data);
    } catch (error) {
      console.error('스포츠 클래스 목록을 가져오는데 실패했습니다:', error);
    }
  };

  // 스포츠 클래스 삭제
  const handleDeleteSportsClass = async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await api.delete(`/admin/sports-class/${id}`);
        fetchSportsClassList();
      } catch (error) {
        console.error('스포츠 클래스 삭제에 실패했습니다:', error);
      }
    }
  };

  // 스포츠 클래스 등록/수정
  const handleSportsClassSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', sportsClassForm.title);
      formData.append('sport', sportsClassForm.sport);
      formData.append('instructor', sportsClassForm.instructor);
      formData.append('schedule', sportsClassForm.schedule);
      formData.append('startDate', sportsClassForm.startDate);
      formData.append('endDate', sportsClassForm.endDate);
      formData.append('maxParticipants', sportsClassForm.maxParticipants.toString());
      formData.append('price', sportsClassForm.price.toString());
      formData.append('level', sportsClassForm.level);
      formData.append('type', sportsClassForm.type);
      formData.append('description', sportsClassForm.description);
      formData.append('location', sportsClassForm.location);
      formData.append('ageGroup', sportsClassForm.ageGroup);
      formData.append('status', sportsClassForm.status);
      if (sportsClassForm.image) {
        formData.append('image', sportsClassForm.image);
      } else if (editingSportsClass && sportsClassForm.imageUrl) {
        formData.append('image', sportsClassForm.imageUrl);
      }

      if (editingSportsClass) {
        await api.put(`/admin/sports-class/${editingSportsClass.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/admin/sports-class', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowSportsClassForm(false);
      setEditingSportsClass(null);
      setSportsClassForm({
        title: '',
        sport: '',
        instructor: '',
        schedule: '',
        startDate: '',
        endDate: '',
        maxParticipants: 0,
        price: 0,
        level: 'BEGINNER',
        type: 'REGULAR',
        description: '',
        image: null,
        imageUrl: null,
        location: '',
        ageGroup: '',
        status: 'RECRUITING'
      });
      fetchSportsClassList();
    } catch (error) {
      console.error('스포츠 클래스 등록/수정에 실패했습니다:', error);
    }
  };

  // 관리자 목록 불러오기
  const fetchManagers = async () => {
    try {
      const { data } = await api.get('/auth/manager');
      setManagers(data.data);
    } catch (error) {
      console.error('관리자 목록을 불러오는데 실패했습니다:', error);
    }
  };

  // 관리자 추가
  const handleManagerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/auth/manager', managerForm);
      setShowManagerForm(false);
      setManagerForm({ user_id: '', password: '', name: '', role: '' });
      fetchManagers();
    } catch (error) {
      console.error('관리자 추가에 실패했습니다:', error);
    }
  };

  // 관리자 삭제
  const handleDeleteManager = async (id: number) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await api.delete(`/auth/manager/${id}`);
        fetchManagers();
      } catch (error) {
        console.error('관리자 삭제에 실패했습니다:', error);
      }
    }
  };

  // 문의 목록 가져오기
  const fetchContactList = async () => {
    try {
      const { data } = await api.get('/admin/contact');
      setContactList(data);
      // 상태/메모 초기화
      const memoObj: {[id:number]: string} = {};
      const statusObj: {[id:number]: string} = {};
      data.forEach((c: Contact) => {
        memoObj[c.id] = c.memo || '';
        statusObj[c.id] = c.status;
      });
      setContactMemo(memoObj);
      setContactStatus(statusObj);
    } catch (error) {
      console.error('문의 목록을 가져오는데 실패했습니다:', error);
    }
  };

  // 문의 상태/메모 수정
  const handleContactUpdate = async (id: number, status?: string) => {
    try {
      await api.patch(`/admin/contact/${id}`, {
        status: status ?? contactStatus[id],
        memo: contactMemo[id],
      });
      fetchContactList(); // 상태/메모 변경 후 목록 갱신
    } catch (error) {
      alert('수정에 실패했습니다.');
    }
  };

  // 신청자 목록 가져오기
  const fetchEnrollmentList = async (sportsClassId: number) => {
    try {
      const { data } = await api.get(`/admin/sports-class/${sportsClassId}/enrollments`);
      setEnrollmentList(data);
    } catch (error) {
      console.error('신청자 목록을 가져오는데 실패했습니다:', error);
    }
  };

  // 신청자 상태 변경
  const handleApplyStatusUpdate = async (id: number, status: string) => {
    try {
      const response = await api.patch(`/admin/enrollments/${id}`, { status });
      
      if (response.status === 200) {
        // 성공 시 목록 새로고침
        if (selectedSportsClass) {
          await fetchEnrollmentList(selectedSportsClass.id);
        }
        
        // 성공 메시지 표시 (선택사항)
        const statusText = status === 'APPROVED' ? '합격' : status === 'REJECTED' ? '불합격' : '대기중';
        console.log(`상태가 ${statusText}로 변경되었습니다.`);
      }
    } catch (error: any) {
      console.error('상태 변경에 실패했습니다:', error);
      
      // 에러 메시지 개선
      if (error.response?.status === 404) {
        alert('해당 신청자를 찾을 수 없습니다.');
      } else if (error.response?.status === 400) {
        alert('잘못된 상태 값입니다.');
      } else {
        alert('상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 경험 수준 번역 함수
  const getExperienceText = (experience: string) => {
    switch (experience?.toUpperCase()) {
      case 'BEGINNER': return '초보자';
      case 'INTERMEDIATE': return '중급자';
      case 'ADVANCED': return '고급자';
      case 'EXPERIENCED': return '경험자';
      case 'EXPERT': return '숙련자';
      default: return experience || '미지정';
    }
  };

  // 신청 상태 번역 함수
  const getEnrollmentStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return '대기중';
      case 'APPROVED': return '합격';
      case 'REJECTED': return '불합격';
      case '처리중': return '처리중';
      case '합격': return '합격';
      case '불합격': return '불합격';
      default: return status || '미지정';
    }
  };

  // 성별 번역 함수
  const getGenderText = (gender: string) => {
    switch (gender?.toUpperCase()) {
      case 'MALE': return '남성';
      case 'FEMALE': return '여성';
      case 'M': return '남성';
      case 'F': return '여성';
      default: return gender || '미지정';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
        
        {/* 탭 메뉴 */}
        <div className="mb-8">
          <nav className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2 ${
                activeTab === 'notices'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              공지사항 관리
            </button>
            <button
                onClick={() => setActiveTab('sports-class')}
                className={`px-4 py-2 ${
                  activeTab === 'sports-class'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                스포츠 클래스 관리
              </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 ${
                activeTab === 'team'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              팀원 관리
            </button>
            <button
              onClick={() => setActiveTab('managers')}
              className={`px-4 py-2 ${
                activeTab === 'managers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              관리자 관리
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 ${
                activeTab === 'contact'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              문의 관리
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              설정
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'notices' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">공지사항 관리</h2>
                <button 
                  onClick={() => setShowNoticeForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  새 공지사항 작성
                </button>
              </div>

              {showNoticeForm && (
                <div className="mb-8 p-6 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (editingNotice) {
                      handleEditNotice(editingNotice.id);
                    } else {
                      handleNoticeSubmit(e);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">제목</label>
                      <input
                        type="text"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">내용</label>
                      <textarea
                        value={noticeForm.content}
                        onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNoticeForm(false);
                          setNoticeForm({ title: '', content: '' });
                        }}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {editingNotice ? '수정' : '저장'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {/* 공지사항 목록 */}
                {noticeList.map((notice) => (
                  <div key={notice.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{notice.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(notice.createdAt).toLocaleString('ko-KR', { hour12: false })}</p>
                      </div>
                      <div className="space-x-2">
                        <button 
                          onClick={() => {
                            setEditingNotice(notice);
                            setNoticeForm({ title: notice.title, content: notice.content });
                            setShowNoticeForm(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

                      {activeTab === 'sports-class' && (
            <div>
              {!showClassEnrollments ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">스포츠 클래스 관리</h2>
                                          <button 
                        onClick={() => setShowSportsClassForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                       새 스포츠 클래스 작성
                    </button>
                  </div>

              {showSportsClassForm && (
                <div className="mb-8 p-6 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    {editingSportsClass ? '스포츠 클래스 수정' : '새 스포츠 클래스 작성'}
                  </h3>
                  <form onSubmit={handleSportsClassSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">제목</label>
                      <input
                        type="text"
                        value={sportsClassForm.title}
                        onChange={(e) => setSportsClassForm({...sportsClassForm, title: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">스포츠 종목</label>
                        <input
                          type="text"
                          value={sportsClassForm.sport}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, sport: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="축구, 농구, 테니스 등"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">강사</label>
                        <input
                          type="text"
                          value={sportsClassForm.instructor}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, instructor: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">일정</label>
                        <input
                          type="text"
                          value={sportsClassForm.schedule}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, schedule: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="매주 화/목 7시"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">위치</label>
                        <input
                          type="text"
                          value={sportsClassForm.location}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, location: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">최대 인원</label>
                        <input
                          type="number"
                          value={sportsClassForm.maxParticipants}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, maxParticipants: Number(e.target.value)})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">수강료 (원)</label>
                        <input
                          type="number"
                          value={sportsClassForm.price}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, price: Number(e.target.value)})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">연령대</label>
                        <input
                          type="text"
                          value={sportsClassForm.ageGroup}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, ageGroup: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="성인, 청소년, 유아 등"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">레벨</label>
                        <select
                          value={sportsClassForm.level}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, level: e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          <option value="BEGINNER">초급</option>
                          <option value="INTERMEDIATE">중급</option>
                          <option value="ADVANCED">고급</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">수업 유형</label>
                        <select
                          value={sportsClassForm.type}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, type: e.target.value as 'REGULAR' | 'PRIVATE' | 'GROUP'})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          <option value="REGULAR">정기반</option>
                          <option value="PRIVATE">개인레슨</option>
                          <option value="GROUP">소그룹</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">시작일</label>
                        <input
                          type="date"
                          value={sportsClassForm.startDate}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, startDate: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">종료일</label>
                        <input
                          type="date"
                          value={sportsClassForm.endDate}
                          onChange={(e) => setSportsClassForm({...sportsClassForm, endDate: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">내용</label>
                      <textarea
                        value={sportsClassForm.description}
                        onChange={(e) => setSportsClassForm({...sportsClassForm, description: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이미지</label>
                      {sportsClassForm.imageUrl && !sportsClassForm.image && (
                        <div className="mt-2 mb-4">
                          <img
                            src={`/api${sportsClassForm.imageUrl}`}
                            alt="현재 이미지"
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSportsClassForm({ ...sportsClassForm, image: e.target.files[0], imageUrl: null });
                          }
                        }}
                        className="mt-1 block w-full"
                        accept="image/*"
                      />
                    </div>
                      {editingSportsClass && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">상태</label>
                        <select
                          value={sportsClassForm.status}
                          onChange={(e) => setSportsClassForm({
                            ...sportsClassForm,
                            status: e.target.value as 'RECRUITING' | 'FULL' | 'SUSPENDED' | 'UPCOMING'
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="RECRUITING">모집중</option>
                          <option value="UPCOMING">개강예정</option>
                          <option value="FULL">정원마감</option>
                          <option value="SUSPENDED">모집중지</option>
                        </select>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSportsClassForm(false);
                          setEditingSportsClass(null);
                          setSportsClassForm({
                            title: '',
                            sport: '',
                            instructor: '',
                            schedule: '',
                            image: null,
                            imageUrl: null,
                            startDate: '',
                            endDate: '',
                            maxParticipants: 0,
                            price: 0,
                            level: 'BEGINNER',
                            type: 'REGULAR',
                            description: '',
                            location: '',
                            ageGroup: '',
                            status: 'RECRUITING'
                          });
                        }}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {editingSportsClass ? '수정' : '저장'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

                  <div className="space-y-4">
                    {sportsClassList.map((sportsClass) => (
                      <div key={sportsClass.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex gap-4 cursor-pointer flex-grow"
                            onClick={() => {
                              setSelectedSportsClass(sportsClass);
                              setShowClassEnrollments(true);
                              fetchEnrollmentList(sportsClass.id);
                            }}
                          >
                            {sportsClass.image && (
                              <div className="w-24 h-24 flex-shrink-0">
                                <img
                                  src={`/api${sportsClass.image}`}
                                  alt={sportsClass.title}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{sportsClass.title}</h3>
                              <p className="text-sm text-gray-500">종목: {sportsClass.sport}</p>
                              <p className="text-sm text-gray-500">강사: {sportsClass.instructor}</p>
                              <p className="text-sm text-gray-500">일정: {sportsClass.schedule}</p>
                              <p className="text-sm text-gray-500">
                                기간: {sportsClass.startDate} ~ {sportsClass.endDate}
                              </p>
                              <p className="text-sm text-gray-500">
                                모집인원: {sportsClass.currentParticipants}/{sportsClass.maxParticipants}명 | 
                                수강료: {sportsClass.price.toLocaleString()}원 | 
                                레벨: {sportsClass.level === 'BEGINNER' ? '초급' : sportsClass.level === 'INTERMEDIATE' ? '중급' : '고급'}
                              </p>
                                                             <p className={`text-sm font-medium ${
                                 sportsClass.status === 'RECRUITING' ? 'text-green-600' :
                                 sportsClass.status === 'FULL' ? 'text-red-600' :
                                 sportsClass.status === 'UPCOMING' ? 'text-blue-600' :
                                 'text-yellow-600'
                               }`}>
                                 상태: {
                                   sportsClass.status === 'RECRUITING' ? '모집중' :
                                   sportsClass.status === 'FULL' ? '정원마감' :
                                   sportsClass.status === 'UPCOMING' ? '개강예정' :
                                   '모집중지'
                                 }
                              </p>
                            </div>
                          </div>
                          <div className="space-x-2">
                            <button 
                              onClick={() => {
                                setEditingSportsClass(sportsClass);
                                setSportsClassForm({
                                  title: sportsClass.title,
                                  sport: sportsClass.sport,
                                  instructor: sportsClass.instructor,
                                  schedule: sportsClass.schedule,
                                  image: null,
                                  imageUrl: sportsClass.image,
                                  startDate: sportsClass.startDate,
                                  endDate: sportsClass.endDate,
                                  maxParticipants: sportsClass.maxParticipants,
                                  price: sportsClass.price,
                                  level: sportsClass.level,
                                  type: sportsClass.type,
                                  description: sportsClass.description,
                                  location: sportsClass.location,
                                  ageGroup: sportsClass.ageGroup,
                                  status: sportsClass.status
                                });
                                setShowSportsClassForm(true);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              수정
                            </button>
                            <button 
                              onClick={() => handleDeleteSportsClass(sportsClass.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowClassEnrollments(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        ← 뒤로
                      </button>
                      <h2 className="text-xl font-semibold">
                        {selectedSportsClass?.title} - 신청자 관리
                      </h2>
                    </div>
                  </div>
                  
                  {selectedSportsClass && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>종목:</strong> {selectedSportsClass.sport}</p>
                          <p><strong>강사:</strong> {selectedSportsClass.instructor}</p>
                          <p><strong>일정:</strong> {selectedSportsClass.schedule}</p>
                          <p><strong>기간:</strong> {selectedSportsClass.startDate} ~ {selectedSportsClass.endDate}</p>
                        </div>
                        <div>
                          <p><strong>모집인원:</strong> {selectedSportsClass.currentParticipants}/{selectedSportsClass.maxParticipants}명</p>
                          <p><strong>수강료:</strong> {selectedSportsClass.price.toLocaleString()}원</p>
                          <p><strong>레벨:</strong> {selectedSportsClass.level === 'BEGINNER' ? '초급' : selectedSportsClass.level === 'INTERMEDIATE' ? '중급' : '고급'}</p>
                          <p><strong>상태:</strong> {
                            selectedSportsClass.status === 'RECRUITING' ? '모집중' :
                            selectedSportsClass.status === 'FULL' ? '정원마감' :
                            selectedSportsClass.status === 'UPCOMING' ? '개강예정' :
                            '모집중지'
                          }</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-3">신청자 목록 (총 {enrollmentList.length}명)</h4>
                    {enrollmentList.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">신청자가 없습니다.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">이름</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">연락처</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">이메일</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">신청일</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">상태</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">메시지</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">상세보기</th>
                            </tr>
                          </thead>
                          <tbody>
                            {enrollmentList.map((enrollment) => (
                              <tr key={enrollment.id} className="border-t border-gray-200">
                                <td className="px-4 py-2">{enrollment.name}</td>
                                <td className="px-4 py-2">{enrollment.phone}</td>
                                <td className="px-4 py-2">{enrollment.email}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">
                                    {new Date(enrollment.createdAt).toLocaleString('ko-KR', { hour12: false })}
                                  </td>
                                <td className="px-4 py-2">
                                  <select
                                    value={enrollment.status}
                                    onChange={(e) => handleApplyStatusUpdate(enrollment.id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-sm border ${
                                      getEnrollmentStatusText(enrollment.status) === '처리중' || getEnrollmentStatusText(enrollment.status) === '대기중' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                      getEnrollmentStatusText(enrollment.status) === '합격' || getEnrollmentStatusText(enrollment.status) === '승인됨' ? 'bg-green-100 text-green-800 border-green-300' :
                                      getEnrollmentStatusText(enrollment.status) === '불합격' || getEnrollmentStatusText(enrollment.status) === '거절됨' ? 'bg-red-100 text-red-800 border-red-300' :
                                      'bg-gray-100 text-gray-800 border-gray-300'
                                    }`}
                                  >
                                                            <option value="PENDING">대기중</option>
                        <option value="APPROVED">합격</option>
                        <option value="REJECTED">불합격</option>
                                  </select>
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                                    onClick={() => setShowMessageModal({open: true, content: enrollment.message})}
                                  >
                                    보기
                                  </button>
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                                    onClick={() => setShowEnrollmentDetailModal({open: true, enrollment: enrollment})}
                                  >
                                    상세보기
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">팀원 관리</h2>
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  새 팀원 추가
                </button>
              </div>
              {showTeamForm && (
                <div className="mb-8 p-6 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    {editingTeam ? '팀원 수정' : '새 팀원 추가'}
                  </h3>
                  <form onSubmit={handleTeamSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이름</label>
                      <input
                        type="text"
                        value={teamForm.name}
                        onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">역할</label>
                      <input
                        type="text"
                        value={teamForm.role}
                        onChange={e => setTeamForm({ ...teamForm, role: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">소개</label>
                      <textarea
                        value={teamForm.description}
                        onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">이미지</label>
                      {teamForm.imageUrl && !teamForm.image && (
                        <div className="mt-2 mb-4">
                          <img
                            src={`/api${teamForm.imageUrl}`}
                            alt="현재 이미지"
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setTeamForm({ ...teamForm, image: e.target.files[0], imageUrl: null });
                          }
                        }}
                        className="mt-1 block w-full"
                        accept="image/*"
                        required={!editingTeam}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTeamForm(false);
                          setEditingTeam(null);
                          setTeamForm({ name: '', role: '', image: null, imageUrl: null, description: '' });
                        }}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {editingTeam ? '수정' : '저장'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={teamList.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                  {teamList.map((member) => (
                    <SortableItem key={member.id} member={member} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === 'managers' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">관리자 관리</h2>
              <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowManagerForm(true)}
              >
                관리자 추가
              </button>
              {/* 관리자 추가 폼 */}
              {showManagerForm && (
                <form
                  className="mb-6 p-4 border rounded bg-gray-50"
                  onSubmit={handleManagerSubmit}
                >
                  <div className="mb-2">
                    <label className="block text-sm font-medium">아이디</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded px-2 py-1"
                      value={managerForm.user_id}
                      onChange={e => setManagerForm({ ...managerForm, user_id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">비밀번호</label>
                    <input
                      type="password"
                      className="mt-1 block w-full border rounded px-2 py-1"
                      value={managerForm.password}
                      onChange={e => setManagerForm({ ...managerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">이름</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded px-2 py-1"
                      value={managerForm.name}
                      onChange={e => setManagerForm({ ...managerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">역할</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border rounded px-2 py-1"
                      value={managerForm.role}
                      onChange={e => setManagerForm({ ...managerForm, role: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">추가</button>
                    <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowManagerForm(false)}>취소</button>
                  </div>
                </form>
              )}
              {/* 관리자 목록 */}
              <ul className="divide-y">
                {managers.map(manager => (
                  <li key={manager.id} className="flex items-center justify-between py-2">
                    <div>
                      <span className="font-medium">{manager.name}</span> <span className="text-gray-500">({manager.user_id})</span> <span className="text-xs text-gray-400">{manager.role}</span>
                    </div>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteManager(manager.id)}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">문의 관리</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden shadow border border-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">ID</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">구분</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">이름/회사명</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">직책</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">연락처</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">이메일</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">문의유형</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">문의내용</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">연락방법</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">상태</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">메모</th>
                      <th className="px-3 py-2 font-bold text-gray-700 text-center">등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactList.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0">
                        <td className="px-3 py-2 text-center">{c.id}</td>
                        <td className="px-3 py-2 text-center">{c.identity === 'company' ? '회사' : '개인'}</td>
                        <td className="px-3 py-2 text-center">{c.identity === 'company' ? c.company : c.name}</td>
                        <td className="px-3 py-2 text-center">{c.position}</td>
                        <td className="px-3 py-2 text-center">{c.phone}</td>
                        <td className="px-3 py-2 text-center">{c.email}</td>
                        <td className="px-3 py-2 text-center">{c.type}</td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <button
                              className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs hover:bg-blue-100 border border-gray-200"
                              onClick={() => setShowMessageModal({open: true, content: c.message})}
                              type="button"
                            >
                              상세보기
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">{c.contactMethod === 'email' ? '이메일' : c.contactMethod === 'phone' ? '전화' : '문자'}</td>
                        <td className="px-3 py-2 text-center">
                          <select
                            value={contactStatus[c.id]}
                            onChange={e => {
                              setContactStatus(s => ({ ...s, [c.id]: e.target.value }));
                              handleContactUpdate(c.id, e.target.value);
                            }}
                            className="border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                          >
                            <option value="미처리">미처리</option>
                            <option value="처리중">처리중</option>
                            <option value="처리완료">처리완료</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <button
                              className="ml-1 px-2 py-0.5 bg-gray-100 rounded-lg text-xs hover:bg-blue-100 border border-gray-200"
                              onClick={() => setShowMemoModal({open: true, id: c.id})}
                              type="button"
                            >
                              상세보기
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs text-center">{new Date(c.createdAt).toLocaleString('ko-KR', { hour12: false })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">시스템 설정</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">사이트 제목</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue="플레이존"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">관리자 이메일</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    defaultValue="playzone@gmail.com"
                  />
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  설정 저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 메모 상세 모달 */}
      {showMemoModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 relative pointer-events-auto border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">메모 상세보기</h3>
            <textarea
              ref={memoInputRef}
              value={contactMemo[showMemoModal.id!]}
              onChange={e => setContactMemo(m => ({ ...m, [showMemoModal.id!]: e.target.value }))}
              className="w-full border rounded p-2 min-h-[80px] mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 border border-gray-200"
                onClick={() => setShowMemoModal({open: false, id: null})}
              >
                닫기
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm"
                onClick={() => {
                  handleContactUpdate(showMemoModal.id!);
                  setShowMemoModal({open: false, id: null});
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
      {showMessageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 relative pointer-events-auto border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">문의내용 상세보기</h3>
            <div className="w-full border rounded p-2 min-h-[80px] mb-4 bg-gray-50 whitespace-pre-wrap break-words">
              {showMessageModal.content}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 border border-gray-200"
                onClick={() => setShowMessageModal({open: false, content: ''})}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신청자 상세보기 모달 */}
      {showEnrollmentDetailModal.open && showEnrollmentDetailModal.enrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 relative pointer-events-auto border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">신청자 상세 정보</h3>
            
            <div className="space-y-4">
              {/* 기본 정보 */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3 text-blue-600">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이름</label>
                    <p className="mt-1 text-gray-900">{showEnrollmentDetailModal.enrollment.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">나이</label>
                    <p className="mt-1 text-gray-900">{showEnrollmentDetailModal.enrollment.age}세</p>
                  </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-700">성별</label>
                     <p className="mt-1 text-gray-900">
                       {getGenderText(showEnrollmentDetailModal.enrollment.gender)}
                     </p>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700">경험 수준</label>
                     <p className="mt-1 text-gray-900">{getExperienceText(showEnrollmentDetailModal.enrollment.experience)}</p>
                   </div>
                </div>
              </div>

              {/* 연락처 정보 */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3 text-blue-600">연락처 정보</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">전화번호</label>
                    <p className="mt-1 text-gray-900">{showEnrollmentDetailModal.enrollment.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-gray-900">{showEnrollmentDetailModal.enrollment.email}</p>
                  </div>
                </div>
              </div>

              {/* 비상연락처 정보 */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3 text-blue-600">비상연락처</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">비상연락처 이름</label>
                    <p className="mt-1 text-gray-900">{showEnrollmentDetailModal.enrollment.emergencyContact || '미입력'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">비상연락처 전화번호</label>
                    <p className="mt-1 text-gray-900">{showEnrollmentDetailModal.enrollment.emergencyPhone || '미입력'}</p>
                  </div>
                </div>
              </div>

              {/* 건강 및 특별사항 */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold mb-3 text-blue-600">건강 및 특별사항</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">건강상 주의사항</label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                      {showEnrollmentDetailModal.enrollment.medicalConditions || '없음'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">특별 요청사항</label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                      {showEnrollmentDetailModal.enrollment.message || '없음'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 신청 정보 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-600">신청 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">신청일</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(showEnrollmentDetailModal.enrollment.createdAt).toLocaleString('ko-KR', { hour12: false })}
                    </p>
                  </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-700">현재 상태</label>
                     <p className="mt-1">
                       <span className={`px-3 py-1 rounded-full text-sm ${
                         getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '처리중' || getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '대기중' ? 'bg-yellow-100 text-yellow-800' :
                         getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '합격' || getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '승인됨' ? 'bg-green-100 text-green-800' :
                         getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '불합격' || getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '거절됨' ? 'bg-red-100 text-red-800' :
                         getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status) === '취소됨' ? 'bg-gray-100 text-gray-800' :
                         'bg-gray-100 text-gray-800'
                       }`}>
                         {getEnrollmentStatusText(showEnrollmentDetailModal.enrollment.status)}
                       </span>
                     </p>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 border border-gray-200"
                onClick={() => setShowEnrollmentDetailModal({open: false, enrollment: null})}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

