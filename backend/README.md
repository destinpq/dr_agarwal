# Dr. Agarwal's Psychology Workshop Backend

This repository contains the backend application for Dr. Agarwal's Psychology Workshop registration system. It's built with NestJS and integrates with PostgreSQL.

## Features

- Workshop registration and payment management
- Email notifications for registration and payment confirmation
- WhatsApp notifications for registration and payment confirmation
- Admin dashboard to manage registrations and payments
- File uploads for payment screenshots

## Prerequisites

- Node.js v18 or higher
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your environment variables:
   ```
   cp .env.example .env
   ```
4. Update the environment variables in `.env` file with your settings

## Environment Variables

### Required Variables
- `PORT`: Port number for the server (default: 3001)
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name

### Email Configuration
- `MAIL_HOST`: SMTP host for sending emails
- `MAIL_PORT`: SMTP port
- `MAIL_USER`: SMTP username
- `MAIL_PASSWORD`: SMTP password
- `MAIL_FROM`: Sender email address
- `MAIL_SECURE`: Use secure connection (true/false)
- `ADMIN_EMAIL`: Admin email to receive notifications

### WhatsApp Configuration
- `WHATSAPP_API_KEY`: API key for WhatsApp Business API
- `WHATSAPP_API_URL`: API URL for WhatsApp Business API
- `WHATSAPP_PHONE_NUMBER_ID`: Phone number ID for WhatsApp Business API

## Development

Start the development server:
```
npm run start:dev
```

## API Endpoints

### Registrations
- `POST /registrations`: Create a new registration
- `GET /registrations`: Get all registrations (admin only)
- `GET /registrations/:id`: Get registration by ID
- `PATCH /registrations/:id`: Update registration (payment status, etc.)
- `DELETE /registrations/:id`: Delete registration (admin only)

## WhatsApp Integration

This application supports WhatsApp notifications for:

1. Registration confirmation
2. Payment confirmation with reference to the screenshot

### Features
- Generates WhatsApp deep links for seamless messaging
- Automatic phone number formatting to international format
- Provides links for both participants and admin use

### How It Works
Instead of using the WhatsApp Business API (which requires business verification and paid plans), this application uses direct WhatsApp links:

1. WhatsApp deep links are generated in the format: `https://wa.me/919873521968?text=Your%20message%20here`
2. The system logs these links for admin use
3. Admin can click the links to open WhatsApp with the pre-populated message
4. The message will be sent from the phone number specified in the environment variable

### Benefits
- No API keys or business verification required
- Messages come from a real WhatsApp number (more personal)
- No costs associated with API usage
- Full message history in the admin's WhatsApp

### Setup
To enable WhatsApp notifications:

1. Update your `.env` file with your WhatsApp phone number:
   ```
   WHATSAPP_FROM_NUMBER=9873521968
   ```
2. Restart the application
3. The system will generate WhatsApp deep links
4. Admin can click these links to send pre-populated messages

### Important Notes
- For screenshots, the participant needs to view them in their email, as WhatsApp deep links cannot include attachments
- This approach requires the admin to manually click the links to send the messages
- All messages will appear to come from the configured phone number

## License

Proprietary. Copyright (c) 2025 Dr. Agarwal's Psychology Workshop. All rights reserved. 