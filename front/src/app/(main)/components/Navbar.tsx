"use client";

// components/Navbar.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import React from 'react';

export default function Navbar({ isMain = false }: { isMain?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFullNavbar, setShowFullNavbar] = useState(false);
  const mainNavy = '#1A237E';

  useEffect(() => {
    if (!isMain) {
      setShowFullNavbar(true);
      return;
    }
    const onScroll = () => setShowFullNavbar(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMain]);

  const menuItems = [
    { href: '/notice', label: '공지사항' },
    { href: '/team', label: '팀소개' },
    { href: '/class', label: '클래스' },
    { href: '/business', label: '비즈니스' },
    { href: '/contact', label: 'Contact Us' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[80px] px-16 flex items-center bg-transparent backdrop-blur-md shadow-xl rounded-2xl mx-8 mt-4`}
        style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', border: '1px solid rgba(255,255,255,0.18)'}}
      >
        {/* 좌측: 로고/브랜드명 (showFullNavbar일 때만) */}
        {showFullNavbar && (
          <Link href="/" className="flex items-center gap-5 group" style={{textDecoration: 'none'}}>
            {/* 로고 이미지 */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-gray-200 transition">
              <Image
                src="/로고.png"
                alt="플레이존 로고"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-3xl font-extrabold tracking-wide font-sans" style={{color: mainNavy}}>
              플레이존
            </span>
          </Link>
        )}
        {/* 데스크탑 메뉴 (showFullNavbar일 때만) */}
        {showFullNavbar && (
          <div className="hidden xl:flex items-center ml-auto h-full">
            {menuItems.map((item, idx) => (
              <React.Fragment key={item.href}>
                <Link
                  href={item.href}
                  className="px-4 text-[18px] font-extrabold font-sans tracking-wide"
                  style={{color: mainNavy}}
                >
                  {item.label}
                </Link>
                {idx < menuItems.length - 1 && (
                  <span className="mx-2 text-gray-300 text-2xl select-none align-middle">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        {/* 햄버거 메뉴(항상 우측) */}
        <button
          className="xl:hidden flex items-center justify-center w-12 h-12 rounded-full transition hover:bg-gray-200 group ml-auto"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="transition text-gray-800 group-hover:text-gray-900">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* 드롭다운 메뉴 (menuOpen일 때만) */}
        {menuOpen && (
          <div className="absolute top-[80px] right-16 w-64 bg-white border border-gray-200 shadow-xl rounded-xl py-4 flex flex-col items-stretch gap-2 xl:hidden transition-all duration-300 origin-top-right z-40">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-extrabold text-[18px] px-8 py-3 rounded hover:bg-gray-100 transition text-center font-sans"
                style={{color: mainNavy}}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
  