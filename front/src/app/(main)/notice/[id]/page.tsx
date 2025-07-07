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

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNotice = async () => {
      try {
        const { data } = await api.get(`/user/notice/${id}`);
        setNotice(data);
      } catch (error) {
        console.error('공지사항 상세 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchNotice();
  }, [id]);

  if (!notice) return <div>로딩 중...</div>;

  return (
    <main className="mt-[80px]">
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{notice.title}</h1>
            <div className="space-y-4 text-gray-600">
              <p>작성일: {new Date(notice.createdAt).toLocaleString('ko-KR', { hour12: false })}</p>
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">상세 내용</h2>
                <p className="whitespace-pre-wrap">{notice.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}
