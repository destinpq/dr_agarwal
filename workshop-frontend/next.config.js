/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:31678']
    }
  },
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  async rewrites() {
    return [
      {
        source: '/api/registrations/:path*',
        destination: 'http://localhost:31678/registrations/:path*',
      },
      {
        source: '/api/registrations',
        destination: 'http://localhost:31678/registrations',
      }
    ];
  },
}

module.exports = nextConfig 