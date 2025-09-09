import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 시 도커 핫리로드
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    }
    return config;
  },

  // 배포 최적화: standalone 실행
  output: "standalone",
  compress: true,
  poweredByHeader: false,

  // ✅ 프론트 → 백엔드 프록시 설정
  async rewrites() {
    return [
      {
        source: "/api/:path*",                // 브라우저에서 /api/* 요청 시
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, 
        // ALB 뒤의 backend Target Group (예: http://alb-dns-name/api)
      },
    ];
  },

  // 빌드 막힘 방지 옵션 (임시 → 운영에선 제거 권장)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
