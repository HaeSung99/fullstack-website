"use client"

import React, { useRef, useEffect, useState, RefObject } from "react";
import Link from 'next/link';
import Image from 'next/image';

// 스크롤 애니메이션 커스텀 훅
function useScrollReveal(direction = "up", threshold = 0.3): [RefObject<HTMLDivElement>, string] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  let base = "opacity-0 ";
  let animate = "opacity-100 ";
  if (direction === "up") {
    base += "translate-y-12 ";
    animate += "translate-y-0 ";
  } else if (direction === "left") {
    base += "-translate-x-12 ";
    animate += "translate-x-0 ";
  } else if (direction === "right") {
    base += "translate-x-12 ";
    animate += "translate-x-0 ";
  }
  const className = `${base}transition-all duration-700 ease-out ${visible ? animate : ""}`;
  return [ref as RefObject<HTMLDivElement>, className];
}

// 정기 클래스 데이터 예시 (더 추가 가능)
const eventList = [
  "축구 정기반 (매주 화/목 7시)",
  "농구 중급반 (매주 수/금 8시)",
  "테니스 주말반 (토/일 오전)",
  "배드민턴 저녁반 (월/수/금 7시)"
];
const PAGE_SIZE = 4;

export default function Home() {
  // 각 섹션별 등장 방향 지정
  const [aboutRef, aboutClass] = useScrollReveal("left");
  const [serviceRef, serviceClass] = useScrollReveal("up");
  const [partnerRef, partnerClass] = useScrollReveal("left");
  const [trustRef, trustClass] = useScrollReveal("up");
  const [ctaRef, ctaClass] = useScrollReveal("up");
  const [contactRef, contactClass] = useScrollReveal("left");
  const [portfolioRef, portfolioClass] = useScrollReveal("left");
  const [promotionRef, promotionClass] = useScrollReveal("left");
  const [portfolioOverlap, setPortfolioOverlap] = useState(true);
  const portfolioOverlapRef = useRef<HTMLDivElement | null>(null);
  const [isOverlapped, setIsOverlapped] = useState(false);

  // 참가 행사 박스 플립 각도 상태 관리 (누적 회전)
  const [flipDegrees, setFlipDegrees] = useState<number[]>([0, 0, 0, 0]);
  const [isFlipping, setIsFlipping] = useState<boolean[]>([false, false, false, false]);
  const handleMouseEnter = (i: number) => {
    if (isFlipping[i]) return; // 이미 회전 중이면 무시
    setIsFlipping(prev => {
      const arr = [...prev];
      arr[i] = true;
      return arr;
    });
    setFlipDegrees(prev => {
      const newArr = [...prev];
      newArr[i] = (newArr[i] || 0) + 360;
      return newArr;
    });
    setTimeout(() => {
      setIsFlipping(prev => {
        const arr = [...prev];
        arr[i] = false;
        return arr;
      });
    }, 1800); // transition 시간과 맞춤
  };

  // 참가 행사 슬라이드 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left"|"right"|null>(null);
  const handleNext = () => {
    setSlideDirection("right");
    setTimeout(() => {
      setCurrentIndex(idx => idx + PAGE_SIZE);
      setSlideDirection(null);
    }, 300);
  };
  const handlePrev = () => {
    setSlideDirection("left");
    setTimeout(() => {
      setCurrentIndex(idx => idx - PAGE_SIZE);
      setSlideDirection(null);
    }, 300);
  };

  // 메인 남색 계열 컬러
  const mainNavy = "#1A237E"; // 진한 남색
  const pointBlue = "#1976D2"; // 포인트 파란색

  useEffect(() => {
    const handleScroll = () => {
      if (!portfolioOverlapRef.current) return;
      const rect = portfolioOverlapRef.current.getBoundingClientRect();
      setPortfolioOverlap(rect.top > 80); // 80px 이하로 올라오면 원상복구
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsOverlapped(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen h-[100vh] flex items-center justify-center bg-black overflow-hidden">
        {/* 배경 비디오/이미지 */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            src="/introvideo.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-black/80 via-[#1A237E]/70 to-black/90 pointer-events-none" />
        </div>
        <div className="relative z-10 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight animate-fadein">플레이존과 함께<br />스포츠를 즐겨보세요</h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 animate-fadein2">정기 스포츠 클래스, 연령별 맞춤 프로그램,<br />전문 케어까지 한 번에!</p>
          <Link href="/class">
            <button style={{backgroundColor: mainNavy, color: "#fff"}} className="py-4 px-10 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-all duration-200 animate-fadein3">클래스 신청하기</button>
          </Link>
        </div>
      </section>

      {/* portfolio Section */}
      <section
        ref={portfolioRef}
        className={
          "w-full flex justify-center py-20 px-4 transition-all duration-1000 z-30 relative bg-gradient-to-br from-[#181c2f] via-[#101322] to-[#232a4d] " +
          (isOverlapped
            ? "rounded-tl-[100px] rounded-tr-[100px] -mt-[20vh] shadow-[0_8px_40px_0_rgba(26,35,126,0.5)] border-2 border-[#232a4d]"
            : "rounded-none mt-0 shadow-none border-0"
          )
        }
      >
        <div className={portfolioClass + " max-w-[1400px] w-full"}>
          <h2 className="text-3xl font-bold text-center mb-8" style={{color: 'white'}}>정기 클래스</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-4">
            {eventList.slice(0, 4).map((classItem, i) => (
              <div
                key={classItem}
                className="flex flex-col items-center justify-center h-130 w-full bg-transparent rounded-2xl shadow p-4 transition-all duration-200 flip-360 text-white"
                onMouseEnter={() => handleMouseEnter(i)}
                style={{
                  cursor: 'pointer',
                  transform: `perspective(600px) rotateY(${flipDegrees[i] || 0}deg)`
                }}
              >
                <div className="relative h-130 w-full bg-black rounded-xl mb-4 overflow-hidden">
                  <Image
                    src={`/포폴${i + 1}.jpg`}
                    alt={`클래스 ${i + 1} 이미지`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                <div className="text-center font-semibold">{classItem}</div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end mt-2">
            <Link href="/class" className="text-lg font-semibold underline underline-offset-4" style={{color: '#5a638a', textDecorationColor: '#5a638a'}}>
              더보기
            </Link>
          </div>
        </div>
      </section>

      {/* About/비전 Section */}
      <section ref={aboutRef} className={`w-full flex justify-center py-24 px-4 ${aboutClass}`} style={{backgroundColor: '#FFF9DB'}}>
        <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center gap-20">
          {/* 이미지 자리 */}
          <div className="flex-1 flex items-center justify-center slide-fadein-left" style={{animationDelay: '0.1s'}}>
            <div className="relative w-80 h-80 bg-gradient-to-tr from-[#6E2C2C]/10 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
              <Image src="/시설.jpg" alt="플레이존 로고" fill className="object-cover rounded-3xl" />
            </div>
          </div>
          {/* 텍스트 */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 leading-tight slide-fadein-left" style={{animationDelay: '0.2s'}}>정기 스포츠 클래스의 선두주자</h2>
            <p className="text-gray-600 mb-8 text-lg slide-fadein-left" style={{animationDelay: '0.3s'}}>플레이존은 축구, 농구, 테니스, 배드민턴 등 다양한 스포츠를 정기적으로 배울 수 있는 전문 클래스를 운영합니다. 연령별, 수준별 맞춤 수업과 최고의 시설, 전문 물리치료까지 제공합니다.</p>
            <div className="flex gap-8">
              <div className="flex flex-col items-center w-28 slide-fadein-left" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 bg-[#6E2C2C]/10 rounded-full flex items-center justify-center mb-2 text-2xl">⚽</div>
                <span className="font-semibold text-gray-700">다양한 종목</span>
              </div>
              <div className="flex flex-col items-center w-28 slide-fadein-left" style={{animationDelay: '0.5s'}}>
                <div className="w-16 h-16 bg-[#6E2C2C]/10 rounded-full flex items-center justify-center mb-2 text-2xl">👨‍👩‍👧‍👦</div>
                <span className="font-semibold text-gray-700">연령별 맞춤</span>
              </div>
              <div className="flex flex-col items-center w-28 slide-fadein-left" style={{animationDelay: '0.6s'}}>
                <div className="w-16 h-16 bg-[#6E2C2C]/10 rounded-full flex items-center justify-center mb-2 text-2xl">💪</div>
                <span className="font-semibold text-gray-700">전문 케어</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Section */}
      <section ref={serviceRef} className={`w-full flex justify-center py-24 px-4 ${serviceClass}`} style={{backgroundColor: '#fff'}}>
        <div className="max-w-[1400px] w-full">
          <h2 className="text-4xl font-bold text-center mb-20 text-gray-900">주요 프로그램</h2>
          
          {/* 계단식 배치 */}
          <div className="relative w-full h-[800px]">
            {/* 첫 번째 - 좌측 상단 */}
              <div className={`absolute top-0 left-0 flex items-center gap-6 ${serviceClass.includes('opacity-100') ? 'animate-stagger-1' : 'opacity-0'}`}>
                <div className="w-80 h-60 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image src="/주요프로그램1.jpg" alt="축구 클래스" width={320} height={240} className="object-contain rounded-2xl max-w-full max-h-full" />
                </div>
              <div className="flex flex-col">
                <h3 className={`text-3xl font-bold text-gray-900 mb-2 ${serviceClass.includes('opacity-100') ? 'typewriter-text' : 'opacity-0'}`} data-text="종목별 정기 클래스">종목별 정기 클래스</h3>
                <p className={`text-gray-600 text-lg max-w-md ${serviceClass.includes('opacity-100') ? 'typewriter-text' : 'opacity-0'}`} data-text="축구, 농구, 테니스, 배드민턴 등 매주 정기적인 수업" style={{animationDelay: '0.7s'}}>축구, 농구, 테니스, 배드민턴 등 매주 정기적인 수업</p>
              </div>
            </div>
            
            {/* 두 번째 - 중간 */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 ${serviceClass.includes('opacity-100') ? 'animate-stagger-2' : 'opacity-0'}`}>
              <div className="w-80 h-60 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden">
                <Image src="/주요프로그램2.jpg" alt="농구 클래스" width={320} height={240} className="object-contain rounded-2xl max-w-full max-h-full" />
              </div>
              <div className="flex flex-col">
                <h3 className={`text-3xl font-bold text-gray-900 mb-2 ${serviceClass.includes('opacity-100') ? 'typewriter-text' : 'opacity-0'}`} data-text="연령별 맞춤 클래스" style={{animationDelay: '1.2s'}}>연령별 맞춤 클래스</h3>
                <p className={`text-gray-600 text-lg max-w-md ${serviceClass.includes('opacity-100') ? 'typewriter-text' : 'opacity-0'}`} data-text="유소년부터 성인까지, 수준별 세분화된 정기 수업" style={{animationDelay: '1.9s'}}>유소년부터 성인까지, 수준별 세분화된 정기 수업</p>
              </div>
            </div>

            {/* 세 번째 - 우측 하단 */}
            <div className={`absolute bottom-0 right-0 flex items-center gap-6 ${serviceClass.includes('opacity-100') ? 'animate-stagger-3' : 'opacity-0'}`}>
              <div className="w-80 h-60 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden">
                <Image src="/주요프로그램3.jpg" alt="테니스 클래스" width={320} height={240} className="object-contain rounded-2xl max-w-full max-h-full" />
              </div>
              <div className="flex flex-col">
                <h3 className={`text-3xl font-bold text-gray-900 mb-2 ${serviceClass.includes('opacity-100') ? 'typewriter-text' : 'opacity-0'}`} data-text="전문 케어 서비스" style={{animationDelay: '1.7s'}}>전문 케어 서비스</h3>
                <p className={`text-gray-600 text-lg max-w-md ${serviceClass.includes('opacity-100') ? 'typewriter-text' : 'opacity-0'}`} data-text="부상 예방부터 물리치료까지, 안전한 스포츠 환경 제공" style={{animationDelay: '2.4s'}}>부상 예방부터 물리치료까지, 안전한 스포츠 환경 제공</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 비즈니스(현장홍보/CTA 통합) Section */}
      <section className="w-full flex flex-col items-center justify-center py-24 px-4 bg-[#101322]">
        <h2 className="text-5xl font-extrabold text-white text-center mb-16">비즈니스 파트너십 with 플레이존</h2>
        <div className="w-full max-w-screen-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* 스포츠 용품 협찬 카드 */}
          <div className="relative group rounded-2xl overflow-hidden flex flex-col items-center justify-between shadow-lg bg-transparent">
            <div className="w-full h-[31.2rem] flex items-center justify-center bg-transparent relative">
              <img src="/이미지1.png" alt="스포츠 용품 협찬" className="object-cover w-full h-full transition duration-500 group-hover:blur-sm" />
              {/* 오버레이: 동그란 디자인, 오버레이 문구와 딱 붙게 */}
              <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center pointer-events-none pb-4">
                <div className="text-white font-semibold text-base bg-transparent border border-white border-[1.5px] rounded-full px-5 py-2 transition-all duration-500 group-hover:-translate-y-10 z-10 select-none mb-0">스포츠 용품 협찬</div>
                <div className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-transparent text-white text-base font-semibold px-6 py-3 mb-0 w-full text-center z-20 select-none" style={{marginTop: 0, paddingTop: 0}}>
                  다양한 스포츠 브랜드와의 협찬 파트너십 제공
                </div>
              </div>
            </div>
          </div>
          {/* 기업 단체 클래스 카드 */}
          <div className="relative group rounded-2xl overflow-hidden flex flex-col items-center justify-between shadow-lg bg-transparent">
            <div className="w-full h-[31.2rem] flex items-center justify-center bg-transparent relative">
              <img src="/이미지2.png" alt="기업 단체 클래스" className="object-cover w-full h-full transition duration-500 group-hover:blur-sm" />
              <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center pointer-events-none pb-4">
                <div className="text-white font-semibold text-base bg-transparent border border-white border-[1.5px] rounded-full px-5 py-2 transition-all duration-500 group-hover:-translate-y-10 z-10 select-none mb-0">기업 단체 클래스</div>
                <div className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-transparent text-white text-base font-semibold px-6 py-3 mb-0 w-full text-center z-20 select-none" style={{marginTop: 0, paddingTop: 0}}>
                  기업 맞춤형 정기 스포츠 클래스 제공
                </div>
              </div>
            </div>
          </div>
          {/* 플레이존 비즈니스 카드 */}
          <div className="relative group rounded-2xl overflow-hidden flex flex-col items-center justify-between shadow-lg bg-transparent">
            <div className="w-full h-[31.2rem] flex items-center justify-center bg-transparent relative">
              <img src="/이미지3.jpg" alt="플레이존 비즈니스" className="object-cover w-full h-full transition duration-500 group-hover:blur-sm" />
              <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center pointer-events-none pb-4">
                <div className="text-white font-semibold text-base bg-transparent border border-white border-[1.5px] rounded-full px-5 py-2 transition-all duration-500 group-hover:-translate-y-10 z-10 select-none mb-0">플레이존 비즈니스</div>
                <div className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-transparent text-white text-base font-semibold px-6 py-3 mb-0 w-full text-center z-20 select-none" style={{marginTop: 0, paddingTop: 0}}>
                  정기 스포츠 클래스 운영 노하우 제공
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full flex justify-center py-20 px-4" style={{backgroundColor: '#101322'}}>
        <div ref={contactRef} className={contactClass + " max-w-[600px] w-full mx-auto text-center"}>
          <h2 className="text-2xl font-bold mb-4" style={{color: '#fff'}}>문의하기</h2>
          <p style={{color: '#f3f4f6'}} className="mb-8">정기 클래스 참가, 개인 레슨, 시설 이용 등 궁금한 점이 있으신가요? 아래 정보를 남겨주시면 빠르게 연락드리겠습니다.</p>
          <div className="w-full bg-gray-100 rounded-xl p-8 flex flex-col gap-4 items-center shadow hover:scale-105 transition-transform duration-200">
            <span className="text-gray-400">[문의 폼 자리]</span>
          </div>
        </div>
      </section>

      {/* 간단한 페이드인 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein { animation: fadein 1s cubic-bezier(.4,0,.2,1) 0.1s both; }
        .animate-fadein2 { animation: fadein 1s cubic-bezier(.4,0,.2,1) 0.3s both; }
        .animate-fadein3 { animation: fadein 1s cubic-bezier(.4,0,.2,1) 0.5s both; }
        @keyframes slideFadeInLeft {
          from { opacity: 0; transform: translateX(-40px);}
          to { opacity: 1; transform: none;}
        }
        .slide-fadein-left { animation: slideFadeInLeft 0.8s cubic-bezier(.4,0,.2,1) both; }
        .flip-hover {
          transition: transform 0.6s cubic-bezier(.4,0,.2,1);
          transform-style: preserve-3d;
        }
        .flip-hover:hover {
          transform: perspective(600px) rotateY(180deg);
        }
        .flip-360 {
          transition: transform 1.8s cubic-bezier(.22,1,.36,1);
          will-change: transform;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slideInRight 0.3s both; }
        .animate-slide-in-left { animation: slideInLeft 0.3s both; }
        
        /* 계단식 등장 애니메이션 */
        @keyframes staggerFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(50px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-stagger-1 { 
          animation: staggerFadeIn 1s cubic-bezier(.4,0,.2,1) 0.3s both; 
        }
        .animate-stagger-2 { 
          animation: staggerFadeIn 1s cubic-bezier(.4,0,.2,1) 0.7s both; 
        }
        .animate-stagger-3 { 
          animation: staggerFadeIn 1s cubic-bezier(.4,0,.2,1) 1.1s both; 
        }
        
        /* 타이핑 애니메이션 */
        @keyframes typewriter {
          from { 
            width: 0; 
            opacity: 0; 
          }
          to { 
            width: 100%; 
            opacity: 1; 
          }
        }
        .typewriter-text {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(30, end) both;
        }
      `}</style>
    </>
  );
}
