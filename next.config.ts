import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */

    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    //   experimental: {
    //     scrollRestoration: true, // ✅ เปิดใช้งาน Scroll Restoration
    //   },
    reactStrictMode: false,
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'ahmedibra.com'
    //         },
    //         {
    //             protocol: 'https',
    //             hostname: 'github.com'
    //         },
    //         {
    //             protocol: 'https',
    //             hostname: 'ui-avatars.com'
    //         },
    //         {
    //             protocol: 'http',
    //             hostname: 'localhost'
    //         }
    //     ]
    // },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            { protocol: 'http', hostname: '**' },
        ],
    },
    // webpack: (config) => {
    //     config.output = {
    //       ...config.output,
    //       chunkLoading: "async", // ✅ ป้องกัน Chunk โหลดล้มเหลว
    //     };
    //     return config;
    //   },

};

export default nextConfig;
