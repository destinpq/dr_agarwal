# Digital Ocean Deployment Guide for NestJS Backend

This document explains how this NestJS backend is configured for deployment on Digital Ocean App Platform.

## Key Files

1. `server.js` - Main entry point that handles both NestJS and health checks
2. `Procfile` - Tells Digital Ocean how to start the application

## Digital Ocean Environment

When deployed to Digital Ocean App Platform:

1. Files are mounted at `/workspace`
2. Health checks are performed on port 8080
3. The NestJS API runs on the port specified by API_PORT (defaults to 3000)

## The Deployment Architecture

This application uses a dual-server approach:

1. **Health Check Server**: Runs on port 8080 to respond to Digital Ocean's health probes
2. **NestJS API Server**: Runs your NestJS application on the configured port

## How It Works

When the application is deployed:

1. Digital Ocean runs `npm run build` which builds the NestJS app
2. Digital Ocean uses the `Procfile` to start `server.js`
3. `server.js` starts both the health check server and the NestJS API

## Health Checks

The application serves health checks at:
- Root (`/`) - Returns simple "OK" text response via the health check server on port 8080
- `/health` - Returns JSON with status information

## Environment Variables

The application uses the following environment variables:

### Server Configuration
- `PORT`: Controls the port for the main application (default: 3001)
- `HEALTH_PORT`: Controls the port for the health check server (default: 8080)
- `NODE_ENV`: Set to 'production' in the Digital Ocean environment

### Database Configuration
- `DB_HOST`: The database host address
- `DB_PORT`: The database port
- `DB_NAME`: The database name
- `DB_USER`: The database username
- `DB_PASSWORD`: The database password
- `DB_SSL_MODE`: Usually 'require' for production

### Email Configuration
- `EMAIL_HOST`: SMTP server host
- `EMAIL_PORT`: SMTP server port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASSWORD`: SMTP password
- `EMAIL_FROM`: From email address

### WhatsApp Configuration
- `WHATSAPP_SESSION_PATH`: Path to store WhatsApp sessions (default: './whatsapp-sessions')
- `WHATSAPP_CLIENT_ID`: Client ID for WhatsApp (default: 'dr-agarwal-workshop')
- `WHATSAPP_TIMEOUT`: Timeout in ms for WhatsApp operations (default: 60000)
- `WHATSAPP_PHONE_NUMBER`: Your WhatsApp phone number with country code (e.g., 919XXXXXXXXX)
- `WHATSAPP_DEFAULT_COUNTRY_CODE`: Default country code to add to numbers (default: 91 for India)

## Troubleshooting

### Error: Cannot find module '/workspace/backend/dist/main.js'

This error occurs when the build process fails. To fix:

1. Make sure there are no TypeScript errors in your code
2. Verify the build script is compiling files to the correct location
3. Check that the `outDir` in `tsconfig.json` and `nest-cli.json` are consistent

### Connection refused on health check

This means the application is not properly listening on port 8080. To fix:

1. Verify the `PORT` environment variable is set to 8080 or the app defaults to 8080
2. Make sure the application is binding to `0.0.0.0` (all interfaces) and not just localhost
3. Check for any firewall or networking issues

## Local Testing

To test the deployment setup locally:

```bash
# Build the app with production settings
npm run build

# Start both servers
npm start

# Test health check
curl http://localhost:8080/health

# Test NestJS API
curl http://localhost:3000
``` 