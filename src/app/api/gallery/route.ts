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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { image, priority } = body;
    
    // Validate required fields
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }

    // Validate priority
    if (!priority || priority < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid priority number (1 or higher) is required' },
        { status: 400 }
      );
    }

    // Check if priority already exists
    const existingPriority = await Gallery.findOne({ priority });
    if (existingPriority) {
      // Auto-increment priorities to make room
      await Gallery.updateMany(
        { priority: { $gte: priority } },
        { $inc: { priority: 1 } }
      );
    }
    
    const galleryItem = new Gallery({
      image,
      priority
    });
    
    await galleryItem.save();
    
    return NextResponse.json({
      success: true,
      data: galleryItem
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    
    // Handle duplicate priority error (though we handle this above, just in case)
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
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}