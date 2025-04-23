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
    
    // Forward the request to the actual backend
    const response = await fetch(redirectUrl, {
      method: 'PATCH',
      body: formData
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