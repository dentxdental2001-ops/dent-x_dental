import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BeforeAfter from '@/models/BeforeAfter';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/before-after called');
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const treatment = searchParams.get('treatment');
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    // Filter by treatment type if provided
    if (treatment) {
      query.treatment = { $regex: treatment, $options: 'i' };
    }
    
    const beforeAfters = await BeforeAfter
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Debug: Log the IDs of fetched records
    console.log('Fetched records:', beforeAfters.map(item => ({ 
      id: item._id.toString(), 
      treatment: item.treatment 
    })));
    
    const total = await BeforeAfter.countDocuments(query);
    console.log(`Total records: ${total}, Page: ${page}, Limit: ${limit}`);
    
    return NextResponse.json({
      success: true,
      data: {
        beforeAfters,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('GET /api/before-after error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch before/after images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/before-after called');
    await connectDB();
    
    const body = await request.json();
    console.log('Request body:', { ...body, beforeImage: body.beforeImage ? 'base64_data' : null, afterImage: body.afterImage ? 'base64_data' : null });
    
    const {
      beforeImage,
      afterImage,
      treatment
    } = body;
    
    // Validate required fields
    if (!beforeImage || !afterImage || !treatment) {
      console.log('Missing required fields:', { beforeImage: !!beforeImage, afterImage: !!afterImage, treatment: !!treatment });
      return NextResponse.json(
        { success: false, error: 'Before image, after image, and treatment are required' },
        { status: 400 }
      );
    }
    
    let beforeImageUrl: string | null = null;
    let afterImageUrl: string | null = null;
    
    try {
      console.log('Uploading images to Cloudinary...');
      
      // Upload before image to Cloudinary
      const beforeUploadResult = await uploadToCloudinary(
        beforeImage,
        'before-after/before',
        `before_${Date.now()}`
      );
      beforeImageUrl = beforeUploadResult.secure_url;
      console.log('Before image uploaded:', beforeImageUrl);
      
      // Upload after image to Cloudinary
      const afterUploadResult = await uploadToCloudinary(
        afterImage,
        'before-after/after',
        `after_${Date.now()}`
      );
      afterImageUrl = afterUploadResult.secure_url;
      console.log('After image uploaded:', afterImageUrl);
      
    } catch (uploadError) {
      console.error('Image upload error:', uploadError);
      
      // Clean up if one upload succeeded but the other failed
      if (beforeImageUrl) {
        try {
          const publicId = extractPublicIdFromUrl(beforeImageUrl);
          await deleteFromCloudinary(publicId);
          console.log('Cleaned up before image after upload failure');
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to upload images to Cloudinary' },
        { status: 400 }
      );
    }
    
    console.log('Creating BeforeAfter record...');
    const beforeAfter = new BeforeAfter({
      beforeImage: beforeImageUrl,
      afterImage: afterImageUrl,
      treatment: treatment.trim()
    });
    
    await beforeAfter.save();
    console.log('BeforeAfter record created:', beforeAfter._id);
    
    return NextResponse.json({
      success: true,
      data: beforeAfter
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/before-after error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create before/after record' },
      { status: 500 }
    );
  }
}