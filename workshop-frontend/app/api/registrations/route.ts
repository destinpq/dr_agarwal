import { NextRequest, NextResponse } from 'next/server';
// Removed unused imports
// import { validateRegistrationData } from '@/utils/validation';
// import { sendConfirmationEmail, sendAdminNotificationEmail } from '@/utils/email';
// import { RegistrationData } from '@/types/registration';

// Hardcoded backend URL
const backendUrl = 'https://plankton-app-jrxs6.ondigitalocean.app/api';

/**
 * Handles POST requests to create a new registration.
 * Validates the incoming data, sends it to the backend, and handles email notifications.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // NOTE: Using environment variable with fallback to handle both local and production
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured. Please set BACKEND_URL in environment variables.' },
        { status: 500 }
      );
    }
    console.log('Forwarding registration to:', `${backendUrl}/api/registrations`);
    
    try {
      const response = await fetch(`${backendUrl}/api/registrations`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.message || 'Failed to register' },
            { status: response.status }
          );
        } else {
          return NextResponse.json(
            { error: `Registration failed: ${response.statusText}` },
            { status: response.status }
          );
        }
      }
      
      const data = await response.json();
      console.log('Registration successful, received data:', data);
      return NextResponse.json(data);
      
    } catch (fetchError) {
      console.error('Connection error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to the backend server' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

// Endpoint to update registration with payment screenshot
export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = request.nextUrl.searchParams.get('id') || formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }
    
    if (id === 'unknown') {
      return NextResponse.json(
        { error: 'Invalid registration ID. Please start registration again.' },
        { status: 400 }
      );
    }
    
    // Get backend URL from environment variables
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured. Please set BACKEND_URL in environment variables.' },
        { status: 500 }
      );
    }
    
    console.log(`Trying to update registration at: ${backendUrl}/api/registrations/${id}`);
    
    try {
      const response = await fetch(`${backendUrl}/api/registrations/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      
      if (!response.ok) {
        console.log(`Backend returned error status: ${response.status}`);
        return NextResponse.json(
          { error: `Update failed: ${response.statusText}` },
          { status: response.status }
        );
      }
      
      try {
        const data = await response.json();
        console.log('Update successful, received data:', data);
        return NextResponse.json(data);
      } catch (jsonError) {
        // If the backend didn't return valid JSON for some reason
        console.error('Error parsing JSON response:', jsonError);
        // Return a clearer error message
        return NextResponse.json(
          { error: 'Backend returned invalid data. Please contact support.' },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      console.error(`Connection error for ${backendUrl}:`, fetchError);
      return NextResponse.json(
        { 
          error: 'Cannot connect to backend server. Please ensure the backend server is running.',
          details: 'Failed to establish connection. Please check your backend configuration.',
        },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating registration' },
      { status: 500 }
    );
  }
}

// Get all registrations
export async function GET() {
  try {
    // Use the real backend to fetch registrations
    const response = await fetch(`${backendUrl}/registrations`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch registrations: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 
