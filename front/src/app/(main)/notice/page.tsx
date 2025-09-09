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

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 9;

export default function NoticePage() {
  const router = useRouter();
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNoticeList = async () => {
      try {
        const { data } = await api.get('/user/notice');
        setNoticeList(data);
      } catch (error) {
        console.error('공지사항 목록을 가져오는데 실패했습니다:', error);
      }
    };

    fetchNoticeList();
  }, []);

  const handleNoticeClick = (id: number) => {
    router.push(`/notice/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="mt-[80px]">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">공지사항</h1>
          <div className="grid grid-cols-1 gap-6">
            {noticeList
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
              )
              .map((notice, idx) => (
                <div
                  key={notice.id}
                  className="relative bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition border border-gray-100"
                  onClick={() => handleNoticeClick(notice.id)}
                >
                  {/* 번호
                  <span className="absolute top-4 right-6 text-xs text-gray-400 select-none">
                    {noticeList.length - ((currentPage - 1) * ITEMS_PER_PAGE + idx)}
                  </span> */}
                  {/* 제목 + 작성일 가로 배치 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-extrabold text-black truncate">
                      {notice.title}
                    </div>
                    <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                      {new Date(notice.createdAt).toLocaleString('ko-KR', { hour12: false })}
                    </div>
                  </div>
                  {/* 내용은 상세페이지에서만 보여주므로 카드에서는 제거 */}
                </div>
              ))}
            {noticeList.length === 0 && (
              <div className="text-center py-16 text-gray-400 bg-white rounded-xl shadow">
                등록된 공지사항이 없습니다.
              </div>
            )}
          </div>
          {/* 페이지네이션 */}
          {noticeList.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({
                length: Math.ceil(noticeList.length / ITEMS_PER_PAGE),
              }).map((_, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 