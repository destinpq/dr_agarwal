/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'localhost:3001', 
        'localhost:31678',
        'workshop.dragarwal.com',
        '*.dragarwal.com'
      ]
    }
  },
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  async rewrites() {
    const API_URL = process.env.API_URL || 'http://localhost:31678';
    return [
      {
        source: '/api/registrations/:path*',
        destination: `${API_URL}/registrations/:path*`,
      },
      {
        source: '/api/registrations',
        destination: `${API_URL}/registrations`,
      }
    ];
  },
}

// Note: When using "output: standalone" configuration,
// use "node .next/standalone/server.js" instead of "next start"
module.exports = nextConfig 