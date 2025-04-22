import { NextRequest, NextResponse } from 'next/server';

// API endpoint for updating a registration by ID
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const id = context.params.id;
    
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
    
    console.log(`Processing update for registration ID: ${id}`);
    
    // Use environment variable or fallback to production URL
    const backendUrl = process.env.BACKEND_URL || 'https://plankton-app-jrxs6.ondigitalocean.app';
    console.log(`Updating registration at: ${backendUrl}/api/registrations/${id}`);
    
    // Log the formData contents for debugging
    console.log('Updating with formData contents:');
    for (const [key, value] of formData.entries()) {
      // Check if it's a file
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    try {
      const response = await fetch(`${backendUrl}/api/registrations/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.message || 'Failed to update registration' },
            { status: response.status }
          );
        } else {
          return NextResponse.json(
            { error: `Update failed: ${response.statusText}` },
            { status: response.status }
          );
        }
      }
      
      const data = await response.json();
      console.log('Update successful, received data:', data);
      return NextResponse.json(data);
      
    } catch (fetchError) {
      console.error('Connection error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to the backend server' },
        { status: 503 }
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