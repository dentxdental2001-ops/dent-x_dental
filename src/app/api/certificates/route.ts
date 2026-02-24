import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const certificates = await Certificate
      .find({})
      .sort({ priority: 1, createdAt: -1 }) // Sort by priority first, then by creation date
      .skip(skip)
      .limit(limit);
    
    const total = await Certificate.countDocuments({});
    
    return NextResponse.json({
      success: true,
      data: {
        certificates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('GET /api/certificates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      image,
      priority
    } = body;
    
    // Validate required fields
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }
    
    // Auto-assign priority if not provided
    let assignedPriority = priority;
    if (!assignedPriority) {
      const maxPriority = await Certificate.findOne({}, { priority: 1 }).sort({ priority: -1 });
      assignedPriority = maxPriority ? maxPriority.priority + 1 : 1;
    } else {
      // If priority is provided, shift existing priorities if needed
      await Certificate.updateMany(
        { priority: { $gte: assignedPriority } },
        { $inc: { priority: 1 } }
      );
    }
    
    const certificate = new Certificate({
      image,
      priority: assignedPriority
    });
    
    await certificate.save();
    
    return NextResponse.json({
      success: true,
      data: certificate
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/certificates error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}