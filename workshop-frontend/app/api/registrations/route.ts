import { NextRequest, NextResponse } from 'next/server';

// API endpoint for registrations
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Use a single backend URL
    const backendUrl = 'http://localhost:8080';
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
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = req.nextUrl.searchParams.get('id') || formData.get('id') as string;
    
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
    
    // Try multiple possible backend URLs
    const possibleBackendUrls = [
      'http://localhost:8080',  // Standard port
      'http://localhost:3001',  // Common NestJS default port
      'http://localhost:5000'   // Another common port
    ];
    
    let successfulResponse = null;
    let lastError = null;
    
    // Try each possible backend URL
    for (const backendUrl of possibleBackendUrls) {
      console.log(`Trying to update registration at: ${backendUrl}/api/registrations/${id}`);
      
      try {
        const response = await fetch(`${backendUrl}/api/registrations/${id}`, {
          method: 'PATCH',
          body: formData,
          // Set a shorter timeout to fail faster
          signal: AbortSignal.timeout(2000)
        });
        
        if (response.ok) {
          successfulResponse = response;
          console.log(`Successfully connected to backend at ${backendUrl}`);
          break;
        } else {
          console.log(`Backend at ${backendUrl} returned error status: ${response.status}`);
          lastError = { status: response.status, url: backendUrl };
        }
      } catch (fetchError) {
        console.error(`Connection error for ${backendUrl}:`, fetchError);
        lastError = { error: fetchError, url: backendUrl };
      }
    }
    
    if (successfulResponse) {
      try {
        const data = await successfulResponse.json();
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
    } else {
      // All connection attempts failed
      console.error('All backend connection attempts failed. Last error:', lastError);
      return NextResponse.json(
        { 
          error: 'Cannot connect to backend server. Please ensure the backend server is running.',
          details: 'Tried connecting to ports 8080, 3001, and 5000. Please check your backend configuration.',
          lastAttempt: lastError?.url || 'unknown'
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
