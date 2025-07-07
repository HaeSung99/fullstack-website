import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 정확히 /admin GET 요청만 인증 필요
  if (request.nextUrl.pathname === '/admin' && request.method === 'GET') {
    const token = request.cookies.get('accesstoken');
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
  // /admin/* 하위 경로는 GET 요청도 인증 없이 허용
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}; 