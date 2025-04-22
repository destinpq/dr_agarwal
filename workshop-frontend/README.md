# Dr. Agarwal Workshop Frontend

Frontend application for Dr. Agarwal's psychology workshop registration system built with Next.js, React, and Ant Design.

## Project Setup

### Prerequisites
- Node.js 20.x
- npm 10.x

### Installation

```bash
# Install dependencies
npm install

# This will also trigger the build step via postinstall script
```

### Development

```bash
# Run in development mode
npm run dev
```

### Production

```bash
# Build the application
npm run build

# Run in production mode
npm start
```

## Deployment to Digital Ocean App Platform

This application is configured for easy deployment to Digital Ocean App Platform:

1. Create a new app in Digital Ocean App Platform
2. Connect to your GitHub repository
3. Set the source directory to `workshop-frontend`
4. The platform will automatically:
   - Detect Node.js and Next.js as the build environment
   - Install dependencies with `npm install`
   - Build with `npm run build`
   - Start the application using the Procfile

### Important Notes:
- The Procfile points to `npm start` which runs the Next.js server
- A postinstall script has been added to ensure the build step runs
- The application is configured to run on port 3001, but the platform may override this

## Frontend Features

- Modern UI using Ant Design components
- Form validation with react-hook-form
- Responsive design for all devices
- Animations and transitions with framer-motion

## License

Proprietary software. All rights reserved.
