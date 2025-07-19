import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 跳过构建时的ESLint检查以加速部署
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 跳过构建时的TypeScript检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // 优化图片处理
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 优化编译
  experimental: {
    optimizePackageImports: ['framer-motion', '@supabase/supabase-js'],
  },
  
  // 生产环境优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  
  // 启用压缩
  compress: true,
  
  // PWA配置准备
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
