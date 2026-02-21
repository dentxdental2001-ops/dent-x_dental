import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BeforeAfter from '@/models/BeforeAfter';
import { deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';
import mongoose from 'mongoose';

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('GET /api/before-after/[id] called with ID:', id);
    
    if (!isValidObjectId(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid record ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const beforeAfter = await BeforeAfter.findById(id);
    console.log('Record found:', !!beforeAfter);
    
    if (!beforeAfter) {
      return NextResponse.json(
        { success: false, error: 'Before/After record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: beforeAfter
    });
    
  } catch (error) {
    console.error('GET /api/before-after/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch before/after record' },
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
    console.log('PUT /api/before-after/[id] called with ID:', id);
    
    if (!isValidObjectId(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid record ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const body = await request.json();
    console.log('Update request body:', { ...body, beforeImage: body.beforeImage ? 'url_present' : null, afterImage: body.afterImage ? 'url_present' : null });
    
    const {
      beforeImage,
      afterImage,
      treatment
    } = body;
    
    // Validation
    if (!beforeImage || !afterImage) {
      console.log('Missing required images:', { beforeImage: !!beforeImage, afterImage: !!afterImage });
      return NextResponse.json(
        { success: false, error: 'Both before and after images are required' },
        { status: 400 }
      );
    }
    
    if (!treatment?.trim()) {
      console.log('Missing or empty treatment field');
      return NextResponse.json(
        { success: false, error: 'Treatment is required' },
        { status: 400 }
      );
    }
    
    const beforeAfter = await BeforeAfter.findById(id);
    console.log('Record found for update:', !!beforeAfter);
    
    if (!beforeAfter) {
      return NextResponse.json(
        { success: false, error: 'Before/After record not found' },
        { status: 404 }
      );
    }
    
    // Clean up old images if they're being replaced
    const deletePromises = [];
    
    if (beforeImage !== beforeAfter.beforeImage && beforeAfter.beforeImage) {
      try {
        const oldPublicId = extractPublicIdFromUrl(beforeAfter.beforeImage);
        if (oldPublicId) {
          deletePromises.push(deleteFromCloudinary(oldPublicId));
          console.log('Scheduled deletion of old before image:', oldPublicId);
        }
      } catch (error) {
        console.error('Error extracting old before image public ID:', error);
      }
    }
    
    if (afterImage !== beforeAfter.afterImage && beforeAfter.afterImage) {
      try {
        const oldPublicId = extractPublicIdFromUrl(beforeAfter.afterImage);
        if (oldPublicId) {
          deletePromises.push(deleteFromCloudinary(oldPublicId));
          console.log('Scheduled deletion of old after image:', oldPublicId);
        }
      } catch (error) {
        console.error('Error extracting old after image public ID:', error);
      }
    }
    
    // Clean up old images (don't wait for completion)
    if (deletePromises.length > 0) {
      Promise.allSettled(deletePromises).catch(error => {
        console.error('Error deleting old images:', error);
      });
    }
    
    // Update the record
    console.log('Updating record with new data...');
    const updatedBeforeAfter = await BeforeAfter.findByIdAndUpdate(
      id,
      {
        beforeImage,
        afterImage,
        treatment: treatment.trim()
      },
      { new: true, runValidators: true }
    );
    
    console.log('Record updated successfully');
    return NextResponse.json({
      success: true,
      data: updatedBeforeAfter
    });
    
  } catch (error) {
    console.error('PUT /api/before-after/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update before/after record' },
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
    console.log('DELETE /api/before-after/[id] called with ID:', id);
    
    if (!isValidObjectId(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid record ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if record exists first
    const beforeAfter = await BeforeAfter.findById(id);
    console.log('Record found for deletion:', !!beforeAfter);
    
    if (!beforeAfter) {
      // Let's also check how many total records exist
      const totalCount = await BeforeAfter.countDocuments();
      console.log('Total records in collection:', totalCount);
      
      // Get all record IDs for debugging
      const allRecords = await BeforeAfter.find({}, '_id treatment').limit(10);
      console.log('Sample records in database:', allRecords.map(r => ({ id: r._id.toString(), treatment: r.treatment })));
      
      return NextResponse.json(
        { success: false, error: 'Before/After record not found' },
        { status: 404 }
      );
    }
    
    console.log('Deleting record:', beforeAfter.treatment);
    
    // Delete the record first
    await BeforeAfter.findByIdAndDelete(id);
    console.log('Record deleted successfully from database');
    
    // Clean up images from Cloudinary (async - don't wait for completion)
    const deletePromises = [];
    
    if (beforeAfter.beforeImage) {
      try {
        const beforePublicId = extractPublicIdFromUrl(beforeAfter.beforeImage);
        if (beforePublicId) {
          deletePromises.push(deleteFromCloudinary(beforePublicId));
          console.log('Scheduled deletion of before image:', beforePublicId);
        }
      } catch (error) {
        console.error('Error extracting before image public ID:', error);
      }
    }
    
    if (beforeAfter.afterImage) {
      try {
        const afterPublicId = extractPublicIdFromUrl(beforeAfter.afterImage);
        if (afterPublicId) {
          deletePromises.push(deleteFromCloudinary(afterPublicId));
          console.log('Scheduled deletion of after image:', afterPublicId);
        }
      } catch (error) {
        console.error('Error extracting after image public ID:', error);
      }
    }
    
    // Clean up images in background (don't block the response)
    if (deletePromises.length > 0) {
      Promise.allSettled(deletePromises).catch(error => {
        console.error('Error deleting images from Cloudinary:', error);
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Before/After record deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/before-after/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete before/after record' },
      { status: 500 }
    );
  }
}