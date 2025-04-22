# Dr. Agarwal Backend API

Backend API for Dr. Agarwal website built with NestJS, TypeScript, and PostgreSQL.

## Project Setup

### Prerequisites
- Node.js 20.x
- npm 10.x
- PostgreSQL database

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
# Database configuration
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_SSL_MODE=require

# Application settings
PORT=3001
NODE_ENV=development

# Admin password for authentication
ADMIN_PASSWORD=your_admin_password
```

### Installation

```bash
# Install dependencies
npm install

# This will also trigger the build step via postinstall script
```

### Development

```bash
# Run in development mode
npm run start:dev

# Run in debug mode
npm run start:debug
```

### Production

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

## Deployment to Digital Ocean App Platform

This application is configured for easy deployment to Digital Ocean App Platform:

1. Create a new app in Digital Ocean App Platform
2. Connect to your GitHub repository
3. Set the source directory to `backend`
4. The platform will automatically:
   - Detect Node.js as the build environment
   - Install dependencies with `npm install`
   - Build with `npm run build`
   - Start the application using the Procfile

### Important Notes:
- The Procfile points to `dist/main.js`, which is the compiled entry point
- `@nestjs/cli` is included as a runtime dependency for build purposes
- A postinstall script has been added to ensure the build step runs

## API Endpoints

The API is accessible under the `/api` prefix.

## License

Proprietary software. All rights reserved. 