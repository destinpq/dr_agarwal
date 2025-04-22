/** @type {import('next').NextConfig} */
const nextConfig = {
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
    const API_URL = process.env.API_URL || 'http://localhost:3001';
    console.log('Using API URL:', API_URL);
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

module.exports = nextConfig 