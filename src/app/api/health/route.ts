import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Test MongoDB connection
    let mongoStatus = 'disconnected';
    try {
      await connectDB();
      mongoStatus = 'connected';
    } catch (mongoError) {
      console.error('MongoDB connection error:', mongoError);
    }
    
    // Test Cloudinary connection
    let cloudinaryStatus = 'disconnected';
    try {
      await cloudinary.api.ping();
      cloudinaryStatus = 'connected';
    } catch (cloudinaryError) {
      console.error('Cloudinary connection error:', cloudinaryError);
    }
    
    const allHealthy = mongoStatus === 'connected' && cloudinaryStatus === 'connected';
    
    return NextResponse.json({
      success: true,
      status: allHealthy ? 'healthy' : 'partial',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus,
        cloudinary: cloudinaryStatus
      },
      environment: {
        node_env: process.env.NODE_ENV,
        mongodb_configured: !!process.env.MONGODB_URI,
        cloudinary_configured: !!(
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
          process.env.NEXT_CLOUDINARY_API_KEY && 
          process.env.NEXT_CLOUDINARY_API_SECRET
        )
      }
    }, { 
      status: allHealthy ? 200 : 503 
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}