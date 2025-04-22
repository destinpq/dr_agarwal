# Local Development Guide

This document explains how to set up and run the Next.js frontend for local development.

## Prerequisites

- Node.js 20.x
- npm 10.x

## Getting Started

1. Clone the repository
2. Navigate to the workshop-frontend directory
3. Install dependencies:

```bash
npm install
```

## Environment Configuration

The application uses a `.env` file for configuration. For local development, ensure it contains:

```
# Backend API URL
BACKEND_URL=http://localhost:3001
API_URL=http://localhost:3001

# Server Ports
PORT=3000
HEALTH_PORT=8081

# Next.js Environment
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Running the Application

To start the development server:

```bash
npm run dev
```

This will start Next.js in development mode on port 3000.

You can also use the combined server (which includes the health check):

```bash
npm start
```

## File Structure

- `app/` - Contains the Next.js application pages and components
- `public/` - Static assets
- `.next/` - Built application (generated)
- `server.js` - Combined server script for Next.js and health checks

## API Routes

API requests are automatically proxied to the backend using the Next.js rewrites configuration in `next.config.js`. The backend URL is determined by the `API_URL` environment variable.

By default, API requests to `/api/registrations/*` are forwarded to `http://localhost:3001/registrations/*`.

## Troubleshooting

### Missing CSS or JavaScript

If you see 404 errors for CSS or JavaScript files, make sure you've built the application with:

```bash
npm run build
```

Then run:

```bash
npm start
```

### Connection Refused Errors

If you see connection refused errors when making API requests, ensure the backend is running at the URL specified in the `.env` file.

### Port Conflicts

If port 3000 is already in use, you can change the port in the `.env` file and in the `package.json` scripts. 