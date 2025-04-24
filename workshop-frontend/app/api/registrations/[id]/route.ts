// This file intentionally left empty for now to resolve build errors
// Originally contained a PATCH handler which caused persistent type issues. 

import { NextRequest, NextResponse } from 'next/server';

// Hardcoded backend URL
const backendUrl = 'https://plankton-app-jrxs6.ondigitalocean.app/api';

// Helper function to find registration by ID (for mock data)
const findRegistrationById = (id: string) => {
  // Sample registrations (same as in main route.ts)
  const registrations = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      age: 25,
      interestArea: 'clinical',
      preferredTiming: 'morning',
      preferredDates: ['2025-05-10', '2025-05-15'],
      expectations: 'I want to learn about psychology fundamentals',
      referralSource: 'social',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '8765432109',
      age: 30,
      interestArea: 'cognitive',
      preferredTiming: 'evening',
      preferredDates: ['2025-05-20', '2025-05-25'],
      expectations: 'Looking to understand cognitive behavioral therapy',
      referralSource: 'friend',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    }
  ];
  
  return registrations.find(reg => reg.id === id);
};

// Get a single registration by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real implementation, you would fetch from your database
    // For now, we'll return mock data
    const registration = findRegistrationById(id);
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}

// Update a registration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // In a real implementation, you would update your database
    // For now, we'll just mock a successful update
    const registration = findRegistrationById(id);
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    // Mock the updated registration
    const updatedRegistration = {
      ...registration,
      ...body,
      id // Make sure ID doesn't change
    };
    
    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

// Delete a registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real implementation, you would delete from your database
    // For now, we'll just mock a successful deletion
    const registration = findRegistrationById(id);
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    // Return success message
    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}

// API endpoint for updating a registration by ID
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Check if backend URL is configured
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured. Please set BACKEND_URL in environment variables.' },
        { status: 500 }
      );
    }

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
    const updateEndpoint = `https://plankton-app-jrxs6.ondigitalocean.app/api/registrations/${id}`;
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

    try {
      const response = await fetch(updateEndpoint, {
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

// Add POST handler that mirrors the PATCH functionality
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Check if backend URL is configured
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured. Please set BACKEND_URL in environment variables.' },
        { status: 500 }
      );
    }

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
    const updateEndpoint = `https://plankton-app-jrxs6.ondigitalocean.app/api/registrations/${id}`;
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

// No need for empty export anymore as PATCH is exported 