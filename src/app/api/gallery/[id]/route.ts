import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Gallery from '@/models/Gallery';



export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    await connectDB();
    
    const gallery = await Gallery
      .find({})
      .sort({ priority: 1, createdAt: -1 }); // Sort by priority first, then by creation date
    
    const total = await Gallery.countDocuments({});
    
    return NextResponse.json({
      success: true,
      data: {
        gallery,
        total
      }
    });
    
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery images' },
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
    const { image, priority } = body;
    // Find the existing gallery item
    const existingItem = await Gallery.findById(id);
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    // Validate fields if they are provided
    if (image !== undefined && !image) {
      return NextResponse.json(
        { success: false, error: 'Image cannot be empty' },
        { status: 400 }
      );
    }
    if (priority !== undefined && (!priority || priority < 1)) {
      return NextResponse.json(
        { success: false, error: 'Valid priority number (1 or higher) is required' },
        { status: 400 }
      );
    }
    // If no fields are provided, return error
    if (image === undefined && priority === undefined) {
      return NextResponse.json(
        { success: false, error: 'At least one field (image or priority) must be provided' },
        { status: 400 }
      );
    }
    // If priority has changed, handle priority adjustments
    if (priority !== undefined && existingItem.priority !== priority) {
      // Check if the new priority already exists (and it's not the current item)
      const otherItemWithPriority = await Gallery.findOne({
        priority,
        _id: { $ne: id }
      });
      if (otherItemWithPriority) {
        // If increasing priority, shift items up
        if (priority > existingItem.priority) {
          await Gallery.updateMany(
            {
              priority: { $gt: existingItem.priority, $lte: priority },
              _id: { $ne: id }
            },
            { $inc: { priority: -1 } }
          );
        }
        // If decreasing priority, shift items down
        else {
          await Gallery.updateMany(
            {
              priority: { $gte: priority, $lt: existingItem.priority },
              _id: { $ne: id }
            },
            { $inc: { priority: 1 } }
          );
        }
      }
    }
    // Build update object with only provided fields
    const updateFields: any = {};
    if (image !== undefined) updateFields.image = image;
    if (priority !== undefined) updateFields.priority = priority;
    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );
    return NextResponse.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    console.error('PUT /api/gallery/[id] error:', error);
    // Handle duplicate priority error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, error: 'Priority number already exists' },
        { status: 409 }
      );
    }
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
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
    const deletedItem = await Gallery.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }
    // Adjust priorities for remaining items to fill the gap
    await Gallery.updateMany(
      { priority: { $gt: deletedItem.priority } },
      { $inc: { priority: -1 } }
    );
    return NextResponse.json({
      success: true,
      data: deletedItem
    });
  } catch (error) {
    console.error('DELETE /api/gallery/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}