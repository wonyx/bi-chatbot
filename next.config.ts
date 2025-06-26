import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';
import analyzer from '@next/bundle-analyzer';

// REF: https://github.com/t3-oss/t3-env/issues/296#issuecomment-2607741693
// NOTE: jiti v1
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./app/env');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
    '@t3-oss/env-nextjs',
    '@t3-oss/env-core',
  ],
  serverExternalPackages: ['@duckdb/node-api', '@duckdb/node-bindings'],
};
const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
