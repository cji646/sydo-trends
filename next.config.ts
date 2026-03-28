import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 💡 외부 이미지 주소를 허용해서 최적화 기능을 활성화합니다.
    remotePatterns: [
      { protocol: 'https', hostname: '**.a-bly.com' },
      { protocol: 'https', hostname: '**.musinsa.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'jojabvihldirdxywlffg.supabase.co' },
    ],
  },
};

export default nextConfig;