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
    // Enable caching features
    enableUndici: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = '/Users/mengkheykhorn/Desktop/task-manager (4) 6';
    return config;
  },
};

export default nextConfig;
