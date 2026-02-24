import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: certificate
    });
    
  } catch (error) {
    console.error('GET /api/certificates/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const body = await request.json();
    const { 
      image,
      priority
    } = body;
    
    // Check if certificate exists
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Validate required fields if provided
    if (image !== undefined && !image.trim()) {
      return NextResponse.json(
        { success: false, error: 'Image cannot be empty' },
        { status: 400 }
      );
    }

    // Handle priority updates with reordering
    if (priority !== undefined && priority !== certificate.priority) {
      const oldPriority = certificate.priority;
      const newPriority = priority;
      
      if (newPriority < oldPriority) {
        // Moving up in priority (lower number), shift others down
        await Certificate.updateMany(
          { 
            _id: { $ne: id },
            priority: { $gte: newPriority, $lt: oldPriority }
          },
          { $inc: { priority: 1 } }
        );
      } else {
        // Moving down in priority (higher number), shift others up
        await Certificate.updateMany(
          { 
            _id: { $ne: id },
            priority: { $gt: oldPriority, $lte: newPriority }
          },
          { $inc: { priority: -1 } }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (image !== undefined) updateData.image = image;
    if (priority !== undefined) updateData.priority = priority;
    
    // Update certificate
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedCertificate
    });
    
  } catch (error) {
    console.error('PUT /api/certificates/[id] error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    const deletedPriority = certificate.priority;
    
    // Delete the certificate
    await Certificate.findByIdAndDelete(id);
    
    // Shift priorities down for items that were after the deleted item
    await Certificate.updateMany(
      { priority: { $gt: deletedPriority } },
      { $inc: { priority: -1 } }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Certificate deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/certificates/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete certificate' },
      { status: 500 }
    );
  }
}