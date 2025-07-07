'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// flip card custom css
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .flip-card {
      width: 100%;
      height: 370px;
      cursor: pointer;
    }
    .flip-card-inner {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .flip-card:hover .flip-card-inner {
      transform: rotateY(180deg);
    }
    .flip-card-front, .flip-card-back {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  `;
  if (!document.head.querySelector('style[data-flipcard]')) {
    style.setAttribute('data-flipcard', 'true');
    document.head.appendChild(style);
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type Member = {
  id: number;
  image: string;
  name: string;
  role: string;
  description: string;
};

const PAGE_SIZE = 9;

export default function Team() {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get('/user/team');
        setMembers(data);
      } catch (error) {
        console.error('팀원 목록을 가져오는데 실패했습니다:', error);
      }
    };
    fetchMembers();
  }, []);

  const totalPages = Math.ceil(members.length / PAGE_SIZE);

  const handlePrev = () => {
    setPage(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage(prev => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const currentMembers = members.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <main className="mt-[80px]">
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">우리 팀을 소개합니다</h2>
          <p className="mt-4 text-lg text-gray-600">최고의 서비스를 제공하기 위해 노력하는 플레이존 팀입니다</p>
        </div>

        
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {currentMembers.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-16 bg-white rounded-xl shadow">
                등록된 팀원이 없습니다.
              </div>
            ) : (
              currentMembers.map(member => (
                <div
                  key={member.id}
                  className="flip-card bg-transparent rounded-lg shadow-lg overflow-visible"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="flip-card-inner relative w-full h-full"
                    style={{ transition: 'transform 0.6s', transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center"
                      style={{ backfaceVisibility: 'hidden', zIndex: 2 }}
                    >
                      <div className="aspect-w-3 aspect-h-2 w-full flex items-center justify-center">
                        <img
                          className="w-40 h-40 object-cover rounded-full mx-auto mt-8 mb-4"
                          src={member.image?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${member.image}` : member.image}
                          alt={member.name}
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-lg font-bold text-blue-600 mt-1">{member.role}</p>
                      </div>
                    </div>
                    <div
                      className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-6"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}
                    >
                      <p className="text-gray-700 text-base text-center">{member.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
      </div>
    </div>
    </main>
  );
}