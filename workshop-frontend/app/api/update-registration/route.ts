import { NextRequest, NextResponse } from 'next/server';
// import { sendEmail } from '@/utils/email'; // Ensure this path is correct -> Removed unused import

// Hardcoded backend URL
const backendUrl = 'https://plankton-app-jrxs6.ondigitalocean.app/api';

// Alternative API endpoint for updating a registration by ID (handles all updates)
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
    
    if (id === 'unknown') {
      return NextResponse.json(
        { error: 'Invalid registration ID. Please start registration again.' },
        { status: 400 }
      );
    }
    
    console.log(`Processing update for registration ID: ${id}`);
    
    // Check if backend URL is configured
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured. Please set BACKEND_URL in environment variables.' },
        { status: 500 }
      );
    }
    
    console.log(`Updating registration at: ${backendUrl}/api/registrations/${id}`);
    
    // Create a new FormData with ONLY payment-related fields
    const paymentFormData = new FormData();
    
    // Check for paymentScreenshot
    if (formData.has('paymentScreenshot')) {
      const screenshot = formData.get('paymentScreenshot');
      if (screenshot instanceof File) {
        console.log(`Adding payment screenshot: ${screenshot.name}, ${screenshot.type}, ${screenshot.size} bytes`);
        paymentFormData.append('paymentScreenshot', screenshot, screenshot.name);
      }
    }
    
    // Add paymentStatus
    paymentFormData.append('paymentStatus', 'completed');
    
    // Log what we're sending
    console.log('Updating with payment data only:');
    for (const [key, value] of paymentFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    try {
      const response = await fetch(`${backendUrl}/api/registrations/${id}`, {
        method: 'PATCH',
        body: paymentFormData,
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