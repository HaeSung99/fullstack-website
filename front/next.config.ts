import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,

  // 내부 프록시: 프론트 컨테이너 → 도커 네트워크의 backend 서비스로 전달
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://backend:4000/:path*" },
    ];
  },

  // 개발 핫리로드(선택)
  webpack: (config, { dev }) => {
    if (dev) config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    return config;
  },

  // 임시 무시 옵션(운영에선 제거 권장)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
