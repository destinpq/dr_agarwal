import { NextRequest, NextResponse } from 'next/server';

// Hardcoded backend URL
const backendUrl = 'https://plankton-app-jrxs6.ondigitalocean.app/api';

// API endpoint for updating a registration by ID
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if backend URL is configured
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured.' },
        { status: 500 }
      );
    }

    // Get the ID from the URL
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Parse form data (used for payment screenshot uploads)
    const formData = await request.formData();

    console.log(`Processing update for registration ID: ${id}`);
    
    // When updating with payment, use the update-registration endpoint
    // This endpoint is specifically designed for payment updates with file uploads
    const updateEndpoint = `${backendUrl}/registrations/${id}`;
    console.log(`Updating registration at: ${updateEndpoint}`);

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

    // Add the ID to the form data if not already present
    if (!formData.has('id')) {
      formData.append('id', id);
    }

    // Set payment status to completed
    if (!formData.has('paymentStatus')) {
      formData.append('paymentStatus', 'completed');
    }

    try {
      // Use PATCH for payment updates
      const response = await fetch(updateEndpoint, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        console.error(`Backend returned error status: ${response.status}`);
        
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to update registration';
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            // Try to get text content if possible
            const errorText = await response.text();
            console.error('Error text:', errorText);
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        );
      }

      // Successfully updated
      try {
        const data = await response.json();
        console.log('Update successful, received data:', data);
        return NextResponse.json({
          ...data,
          message: 'Your payment has been confirmed. A confirmation email has been sent to your registered email address.'
        });
      } catch (jsonError) {
        // If backend didn't return JSON
        console.error('Error parsing response JSON:', jsonError);
        return NextResponse.json({
          success: true,
          message: 'Your payment has been confirmed.'
        });
      }
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
