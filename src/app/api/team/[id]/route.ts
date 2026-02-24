import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const teamMember = await Team.findById(id);
    
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: teamMember
    });
    
  } catch (error) {
    console.error('GET /api/team/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
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
      name, 
      role, 
      startYear, 
      image
    } = body;
    
    // Check if team member exists
    const teamMember = await Team.findById(id);
    
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Validate required fields if provided
    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name cannot be empty' },
        { status: 400 }
      );
    }

    if (role !== undefined && !role.trim()) {
      return NextResponse.json(
        { success: false, error: 'Role cannot be empty' },
        { status: 400 }
      );
    }

    if (startYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (startYear < 1980 || startYear > currentYear) {
        return NextResponse.json(
          { success: false, error: 'Start year must be between 1980 and current year' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (role !== undefined) updateData.role = role.trim();
    if (startYear !== undefined) updateData.startYear = startYear;
    if (image !== undefined) updateData.image = image;
    
    // Update team member
    const updatedTeamMember = await Team.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedTeamMember
    });
    
  } catch (error) {
    console.error('PUT /api/team/[id] error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
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
    
    const teamMember = await Team.findById(id);
    
    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    await Team.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/team/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}