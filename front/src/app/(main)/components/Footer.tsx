import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* 회사 정보 */}
                <div>
                <h3 className="text-lg font-semibold mb-4">플레이존</h3>
                <p className="text-gray-600 text-sm">
                    스포츠와 놀이를 통해<br />
                    건강하고 즐거운 삶을 제공합니다
                </p>
                </div>

                {/* 빠른 링크 */}
                <div>
                <h3 className="text-lg font-semibold mb-4">바로가기</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/notice" className="text-gray-600 hover:text-gray-900">공지사항</Link></li>
                    <li><Link href="/team" className="text-gray-600 hover:text-gray-900">팀소개</Link></li>
                    <li><Link href="/class" className="text-gray-600 hover:text-gray-900">클래스</Link></li>
                    <li><Link href="/business" className="text-gray-600 hover:text-gray-900">비즈니스</Link></li>
                    <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
                </ul>
                </div>

                {/* 연락처 */}
                <div>
                <h3 className="text-lg font-semibold mb-4">연락처</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>이메일: playzone@gmail.com</li>
                    <li>전화: 010-1234-5678</li>
                    <li>운영시간: 평일 09:00 - 18:00</li>
                </ul>
                </div>

                {/* 소셜 미디어 */}
                <div>
                <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                    <span className="sr-only">YouTube</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a2.997 2.997 0 00-2.112-2.12C19.477 3.5 12 3.5 12 3.5s-7.477 0-9.386.566a2.997 2.997 0 00-2.112 2.12A31.13 31.13 0 000 12a31.13 31.13 0 00.502 5.814 2.997 2.997 0 002.112 2.12C4.523 20.5 12 20.5 12 20.5s7.477 0 9.386-.566a2.997 2.997 0 002.112-2.12A31.13 31.13 0 0024 12a31.13 31.13 0 00-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    </a>
                </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>&copy; 2025 플레이존. All rights reserved.</p>
            </div>
            </div>
        </footer>
    );
}