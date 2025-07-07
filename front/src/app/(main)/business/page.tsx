"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function Business() {
  const router = useRouter();

  const handleContact = () => {
    router.push('/contact');
  };

  // 애니메이션 카운터 훅
  function useCountUp(target: number, duration = 1500) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = target;
      if (start === end) return;
      const frameRate = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        setCount(Math.floor(progress * (end - start) + start));
        if (progress === 1) clearInterval(counter);
      }, frameRate);
      return () => clearInterval(counter);
    }, [target, duration]);
    return count;
  }

  // FAQ 아코디언 상태
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const faqs = [
    { q: '정기 클래스는 어떻게 진행되나요?', a: '주 1-3회 정기적으로 진행되며, 연령별/수준별로 세분화된 체계적인 수업을 제공합니다.' },
    { q: '개인 레슨도 가능한가요?', a: '1:1 개인 레슨부터 소그룹 레슨까지 맞춤형 수업이 가능합니다.' },
    { q: '회원제는 어떻게 운영되나요?', a: '월 회원제로 운영되며, 자유롭게 원하는 클래스를 선택하여 참여할 수 있습니다.' },
    { q: '초보자도 참여할 수 있나요?', a: '초급자부터 고급자까지 수준별로 클래스가 구분되어 있어 누구나 참여 가능합니다.' },
  ];
  // 클래스 활동 사진 예시
  const galleryImages = [
    '/이미지1.png',
    '/이미지2.png',
    '/주요프로그램1.jpg',
    '/주요프로그램2.jpg',
    '/포폴1.jpg',
    '/포폴2.jpg',
    '/포폴3.jpg',
    '/포폴4.jpg',
  ];

  return (
    <main className="mt-[110px]">
      <div className="max-w-7xl mx-auto">
        {/* 히어로 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold mb-6">취미 스포츠의 새로운 시작, 플레이존</h1>
            <p className="text-xl text-gray-600 mb-8">축구, 농구, 테니스, 배드민턴 등 다양한 스포츠를 정기 클래스로 체계적으로 배우고 즐겨보세요!</p>
          </div>
        </div>

        {/* 성과 통계 섹션 */}
        <div className="py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">플레이존의 주요 성과</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {useCountUp(25)}개+
              </div>
              <p className="text-gray-600">정기 운영 클래스</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {useCountUp(800)}명+
              </div>
              <p className="text-gray-600">월 정기 회원</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {useCountUp(12)}종목
              </div>
              <p className="text-gray-600">다양한 스포츠 종목</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {useCountUp(95)}%
              </div>
              <p className="text-gray-600">회원 만족도</p>
            </div>
          </div>
        </div>

        {/* 클래스 활동 갤러리 섹션 */}
        <div className="py-20 px-4 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12">클래스 활동 갤러리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {galleryImages.map((src, idx) => (
              <div key={idx} className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img src={src} alt={`클래스활동${idx+1}`} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 서비스 섹션 */}
        <div className="bg-gray-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">플레이존 프로그램</h2>
            {/* 정기 스포츠 클래스 */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-6">정기 스포츠 클래스</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">다양한 종목</h4>
                  <p className="text-gray-600">축구, 농구, 테니스, 배드민턴, 탁구, 요가 등 12가지 스포츠를 정기적으로 배울 수 있습니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">연령별 수준별 분반</h4>
                  <p className="text-gray-600">초급, 중급, 고급으로 나누어 체계적인 커리큘럼으로 단계적 실력 향상이 가능합니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">정기 시간표</h4>
                  <p className="text-gray-600">매주 고정된 시간에 진행되어 규칙적인 운동 습관을 만들 수 있습니다.</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <button 
                  onClick={handleContact}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  정기 클래스 문의하기
                </button>
              </div>
            </div>
            {/* 개인/소그룹 레슨 */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-6">개인 & 소그룹 레슨</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">1:1 개인 레슨</h4>
                  <p className="text-gray-600">전담 코치와 함께하는 맞춤형 개인 레슨으로 빠른 실력 향상이 가능합니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">소그룹 레슨 (2-4명)</h4>
                  <p className="text-gray-600">친구, 가족과 함께하는 소그룹 레슨으로 더욱 재미있게 운동할 수 있습니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">유연한 스케줄</h4>
                  <p className="text-gray-600">개인 일정에 맞춰 수업 시간을 조정할 수 있어 바쁜 분들에게 최적입니다.</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <button 
                  onClick={handleContact}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  개인 레슨 문의하기
                </button>
              </div>
            </div>
            {/* 특별 프로그램 & 회원 혜택 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">특별 프로그램 & 회원 혜택</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">시즌별 특별 프로그램</h4>
                  <p className="text-gray-600">여름 수영 집중반, 겨울 실내 스포츠 등 계절별 특화 프로그램을 운영합니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">회원 전용 혜택</h4>
                  <p className="text-gray-600">시설 무료 이용, 용품 할인, 우선 예약 등 다양한 회원 전용 혜택을 제공합니다.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">건강 케어 서비스</h4>
                  <p className="text-gray-600">전문 트레이너의 체성분 분석, 운동 처방, 부상 예방 관리 서비스를 제공합니다.</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <button 
                  onClick={handleContact}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  회원가입 문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ 섹션 */}
      <div className="max-w-3xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
        <div className="space-y-5">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`transition-shadow duration-300 rounded-2xl border bg-white ${isOpen ? 'shadow-xl border-blue-400' : 'shadow-sm border-gray-200'}`}
              >
                <button
                  className={`w-full flex items-center justify-between px-7 py-6 text-lg font-semibold focus:outline-none transition-colors duration-200 ${isOpen ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'}`}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-grid w-8 h-8 bg-blue-100 text-blue-600 rounded-full place-items-center font-bold mr-2 text-base leading-none text-center font-sans">Q</span>
                    {item.q}
                  </span>
                  <span className={`ml-4 text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <div
                  id={`faq-content-${idx}`}
                  className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-40 opacity-100 py-5 px-7' : 'max-h-0 opacity-0 py-0 px-7'}`}
                  style={{background: isOpen ? '#f8fafc' : 'white'}}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-grid w-8 h-8 bg-blue-100 text-blue-600 rounded-full place-items-center font-bold text-base leading-none text-center font-sans">A</span>
                    <span className="text-gray-700 leading-relaxed">{item.a}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}