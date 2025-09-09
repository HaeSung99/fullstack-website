"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: "/api",
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

type FilterStatus = 'ALL' | 'RECRUITING' | 'FULL' | 'UPCOMING' | 'SUSPENDED';

const ITEMS_PER_PAGE = 9;

export default function ClassPage() {
  const router = useRouter();
  const [classList, setClassList] = useState<SportsClass[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const { data } = await api.get('/user/sports-class');
        setClassList(data);
      } catch (error) {
        console.error('클래스 목록을 가져오는데 실패했습니다:', error);
      }
    };

    fetchClassList();
  }, []);

  const handleClassClick = (id: number) => {
    router.push(`/class/${id}`);
  };

  const filteredList = classList.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECRUITING': return 'text-green-600';
      case 'FULL': return 'text-red-600';
      case 'UPCOMING': return 'text-blue-600';
      case 'SUSPENDED': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <main className="mt-[80px]">
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">스포츠 클래스</h1>
        
        <div className="space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">정기 클래스</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilterStatus('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filterStatus === 'ALL'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('RECRUITING');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filterStatus === 'RECRUITING'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  모집중
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('UPCOMING');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filterStatus === 'UPCOMING'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  개강예정
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('FULL');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    filterStatus === 'FULL'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  정원마감
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleClassClick(item.id)}
                >
                  {item.image && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={`/api${item.image}`}
                        alt={item.title}
                        className="object-cover w-full h-48"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">종목:</span> {item.sport}</p>
                      <p><span className="font-medium">강사:</span> {item.instructor}</p>
                      <p><span className="font-medium">일정:</span> {item.schedule}</p>
                      <p><span className="font-medium">기간:</span> {item.startDate} ~ {item.endDate}</p>
                      <p><span className="font-medium">레벨:</span> {getLevelText(item.level)} | {getTypeText(item.type)}</p>
                      <p><span className="font-medium">모집인원:</span> {item.currentParticipants}/{item.maxParticipants}명</p>
                      <p><span className="font-medium">수강료:</span> {item.price.toLocaleString()}원</p>
                      <p><span className="font-medium">위치:</span> {item.location}</p>
                      <p className={`font-medium ${getStatusColor(item.status)}`}>
                        상태: {getStatusText(item.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">해당 조건의 클래스가 없습니다.</p>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
                >
                  이전
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
    </main>
  );
} 