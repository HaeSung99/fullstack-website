import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker에서 핫 리로딩을 위한 설정 (개발 환경에서만)
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // 배포 환경 최적화
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  compress: true,
  poweredByHeader: false,
  // 실험적 기능
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
