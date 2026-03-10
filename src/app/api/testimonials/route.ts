import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const testimonials = await Testimonial
      .find({})
      .sort({ createdAt: -1 });
    
    const total = await Testimonial.countDocuments({});
    
    return NextResponse.json({
      success: true,
      data: {
        testimonials,
        total
      }
    });
    
  } catch (error) {
    console.error('GET /api/testimonials error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { description, name, role } = body;
    
    // Validate required fields
    if (!description || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Description, name, and role are required' },
        { status: 400 }
      );
    }
    
    const testimonial = new Testimonial({
      description,
      name,
      role
    });
    
    await testimonial.save();
    
    return NextResponse.json({
      success: true,
      data: testimonial
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/testimonials error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}