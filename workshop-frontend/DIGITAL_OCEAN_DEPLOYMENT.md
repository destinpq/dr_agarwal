# Digital Ocean Deployment Guide for Next.js Frontend

This document explains how this Next.js frontend is configured for deployment on Digital Ocean App Platform.

## Key Files

1. `server.js` - Main entry point that handles both Next.js and health checks
2. `Procfile` - Tells Digital Ocean how to start the application
3. `next.config.js` - Configured for standalone mode and API rewrites

## Environment Variables

The application uses the following environment variables:

### API Configuration
- `BACKEND_URL`: The URL of the backend API (e.g., https://plankton-app-jrxs6.ondigitalocean.app)
- `API_URL`: Same as BACKEND_URL, used in some parts of the application

### Server Configuration
- `PORT`: The port for the Next.js application (default: 3001)  
- `HEALTH_PORT`: The port for the health check server (default: 8080)
- `NODE_ENV`: The environment (should be 'production' for deployment)
- `NEXT_PUBLIC_SITE_URL`: The public URL of the frontend

## Deployment Architecture

This application uses a dual-server approach:

1. **Health Check Server**: A simple HTTP server that listens on port 8080
2. **Next.js Server**: The main Next.js application that serves the frontend

## How It Works

1. Digital Ocean builds the application with `npm run build`
2. The build process creates a standalone Next.js application
3. Digital Ocean starts the server with `node server.js`
4. The server.js file starts both the health check and the Next.js app

## Current Backend URL

The backend API is hosted at: https://plankton-app-jrxs6.ondigitalocean.app

## API Routing

API requests are routed to the backend using Next.js rewrites in next.config.js:
- `/api/registrations/*` → `${API_URL}/registrations/*`

## Health Checks

Digital Ocean monitors the application's health by making requests to port 8080.
The health check server responds with a 200 OK status to indicate that the application is running.

## Troubleshooting

### Health Check Failures

If you see errors like "Readiness probe failed: dial tcp 10.244.x.x:8080: connect: connection refused", check:

1. The server.js file is correctly starting the health check server
2. The HEALTH_PORT environment variable is set to 8080
3. There are no errors in the server logs

### API Connection Issues

If the frontend can't connect to the backend, check:

1. The BACKEND_URL and API_URL environment variables are set correctly
2. The backend is running and accessible
3. CORS is properly configured on the backend to allow requests from the frontend

## Local Testing

To test the deployment setup locally:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm start

# Check if the health server is running
curl http://localhost:8080

# Check if the Next.js application is running
curl http://localhost:3001
``` 