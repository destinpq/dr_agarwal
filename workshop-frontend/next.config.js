/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:31678', process.env.ALLOWED_HOST]
    }
  },
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  async rewrites() {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:31678';
    return [
      {
        source: '/api/registrations/:path*',
        destination: `${apiUrl}/registrations/:path*`,
      },
      {
        source: '/api/registrations',
        destination: `${apiUrl}/registrations`,
      }
    ];
  },
}

module.exports = nextConfig 