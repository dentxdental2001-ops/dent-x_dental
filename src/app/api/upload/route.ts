import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, folder, publicId } = body;
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }
    
    const uploadResult = await uploadToCloudinary(
      image,
      folder || 'uploads',
      publicId
    );
    
    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes
      }
    });
    
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, publicId } = body;
    
    if (!url && !publicId) {
      return NextResponse.json(
        { success: false, error: 'URL or public ID is required' },
        { status: 400 }
      );
    }
    
    let imagePublicId = publicId;
    
    if (!publicId && url) {
      imagePublicId = extractPublicIdFromUrl(url);
    }
    
    const deleteResult = await deleteFromCloudinary(imagePublicId);
    
    return NextResponse.json({
      success: true,
      data: deleteResult,
      message: 'Image deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}