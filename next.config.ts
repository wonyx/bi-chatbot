import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';

// REF: https://github.com/t3-oss/t3-env/issues/296#issuecomment-2607741693
// NOTE: jiti v1
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./app/env');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  transpilePackages: [
    'echarts',
    'zrender',
    'next-mdx-remote',
    '@t3-oss/env-nextjs',
    '@t3-oss/env-core',
  ],
  serverExternalPackages: ['@duckdb/node-api', '@duckdb/node-bindings'],
};

export default nextConfig;
