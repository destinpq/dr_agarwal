/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output mode for better deployment compatibility
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
  
  // Ensure Ant Design components are properly transpiled
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  
  // Add custom error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Add API rewrites for backend communication
  async rewrites() {
    const BACKEND_URL = process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('BACKEND_URL environment variable is not set!');
      throw new Error('BACKEND_URL must be configured in environment variables');
    }
    console.log('Using Backend URL:', BACKEND_URL);
    return [
      {
        source: '/api/registrations/:path*',
        destination: `${BACKEND_URL}/api/registrations/:path*`,
      },
      {
        source: '/api/registrations',
        destination: `${BACKEND_URL}/api/registrations`,
      }
    ];
  },
  
  // Exclude problematic route from build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  excludeRoutes: ['/api/registrations/[id]'],
}

module.exports = nextConfig 