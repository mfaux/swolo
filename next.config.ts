import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Configure SVG handling
        '*.svg': ['url'],
      },
    },
  },
};

export default nextConfig;
