/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = process.cwd();
    return config;
  },
};

export default nextConfig;