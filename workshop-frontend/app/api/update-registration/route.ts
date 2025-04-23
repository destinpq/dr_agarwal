import { NextRequest, NextResponse } from 'next/server';
// import { sendEmail } from '@/utils/email'; // Ensure this path is correct -> Removed unused import

// Hardcoded backend URL
const backendUrl = 'https://plankton-app-jrxs6.ondigitalocean.app/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`Processing registration update for ID: ${id}`);
    
    // Use the dedicated update endpoint in the backend
    const updateEndpoint = `${backendUrl.replace(/\/api$/, '')}/api/registrations/update-registration`;
    console.log(`Forwarding to backend at: ${updateEndpoint}`);
    
    try {
      const response = await fetch(updateEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.message || errorData.error || 'Failed to update registration' },
            { status: response.status }
          );
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          return NextResponse.json(
            { error: `Update failed: ${response.statusText}` },
            { status: response.status }
          );
        }
      }
      
      const data = await response.json();
      console.log('Update successful, received data:', data);
      return NextResponse.json({
        ...data,
        message: 'Your payment has been confirmed. A confirmation email has been sent to your registered email address.'
      });
      
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