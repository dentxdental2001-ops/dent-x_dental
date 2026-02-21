import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: testimonial
    });
    
  } catch (error) {
    console.error('GET /api/testimonials/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonial' },
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
    const { description, name, role } = body;
    
    // Validation
    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }
    
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    if (!role?.trim() || !['doctor', 'patient'].includes(role.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Valid role is required (doctor or patient)' },
        { status: 400 }
      );
    }
    
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    // Update testimonial
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        description: description.trim(),
        name: name.trim(),
        role: role.toLowerCase()
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedTestimonial
    });
    
  } catch (error) {
    console.error('PUT /api/testimonials/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
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
    
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    await Testimonial.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/testimonials/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}