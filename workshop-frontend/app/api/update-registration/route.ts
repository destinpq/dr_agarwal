import { NextRequest, NextResponse } from 'next/server';
// import { sendEmail } from '@/utils/email'; // Ensure this path is correct -> Removed unused import

// Hard redirect to the real backend URL
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
    
    // Redirect to the correct backend URL
    const redirectUrl = `https://plankton-app-jrxs6.ondigitalocean.app/api/registrations/${id}`;
    console.log(`Redirecting to correct backend URL: ${redirectUrl}`);
    
    // Create a new FormData with special handling for the file
    const paymentFormData = new FormData();
    
    // Explicitly handle the payment screenshot file
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
    console.log('Forwarding with payment data:');
    for (const [key, value] of paymentFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    
    // Forward the request to the actual backend
    const response = await fetch(redirectUrl, {
      method: 'POST',
      body: paymentFormData
    });
    
    // Return the backend's response directly
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: response.status });
    
  } catch (error) {
    console.error('Error in update-registration redirect route:', error);
    return NextResponse.json(
      { error: 'An error occurred forwarding your request to the backend' },
      { status: 500 }
    );
  }
} 