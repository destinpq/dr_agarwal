import { NextRequest, NextResponse } from 'next/server';

// API endpoint for registrations
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // NOTE: Using environment variable with fallback to handle both local and production
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
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
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    
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
