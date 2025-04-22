import { NextRequest, NextResponse } from 'next/server';

// API endpoint for registrations
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Forward the request to the backend API with correct port
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:31678';
    
    console.log('Forwarding registration to:', `${backendUrl}/registrations`);
    
    const response = await fetch(`${backendUrl}/registrations`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      // Handle error response based on content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.message || 'Failed to register' },
            { status: response.status }
          );
        } catch (jsonError) {
          // If JSON parsing fails, return the status text with the error
          console.error('Error parsing error JSON:', jsonError);
          return NextResponse.json(
            { error: `Registration failed: ${response.statusText}` },
            { status: response.status }
          );
        }
      } else {
        // If not JSON, return the status with generic message
        return NextResponse.json(
          { error: `Registration failed: ${response.statusText}` },
          { status: response.status }
        );
      }
    }
    
    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (jsonError) {
      // If the backend didn't return valid JSON for some reason
      console.error('Error parsing JSON response:', jsonError);
      return NextResponse.json(
        { id: 'unknown', status: 'created' },
        { status: 201 }
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
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }
    
    // Forward the request to the backend API with correct port
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:31678';
    
    console.log('Updating registration:', `${backendUrl}/registrations/${id}`);
    
    const response = await fetch(`${backendUrl}/registrations/${id}`, {
      method: 'PATCH',
      body: formData,
    });
    
    if (!response.ok) {
      // Handle error response based on content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.message || 'Failed to update registration' },
            { status: response.status }
          );
        } catch (jsonError) {
          // If JSON parsing fails, return the status text with the error
          console.error('Error parsing error JSON:', jsonError);
          return NextResponse.json(
            { error: `Update failed: ${response.statusText}` },
            { status: response.status }
          );
        }
      } else {
        // If not JSON, return the status with generic message
        return NextResponse.json(
          { error: `Update failed: ${response.statusText}` },
          { status: response.status }
        );
      }
    }
    
    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (jsonError) {
      // If the backend didn't return valid JSON for some reason
      console.error('Error parsing JSON response:', jsonError);
      return NextResponse.json(
        { id: id, status: 'updated' },
        { status: 200 }
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