import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    
    const team = await Team
      .find({})
      .sort({ priority: 1, startYear: 1, createdAt: -1 }) // Sort by priority first, then by start year, then by creation date
      .skip(skip)
      .limit(limit);
    
    const total = await Team.countDocuments({});
    
    return NextResponse.json({
      success: true,
      data: {
        team,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('GET /api/team error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      name, 
      role, 
      startYear, 
      image,
      priority
    } = body;
    
    // Validate required fields
    if (!name || !role || !startYear || !image) {
      return NextResponse.json(
        { success: false, error: 'Name, role, start year, and image are required' },
        { status: 400 }
      );
    }

    // Validate start year
    const currentYear = new Date().getFullYear();
    if (startYear < 1980 || startYear > currentYear) {
      return NextResponse.json(
        { success: false, error: 'Start year must be between 1980 and current year' },
        { status: 400 }
      );
    }
    
    // Auto-assign priority if not provided
    let assignedPriority = priority;
    if (!assignedPriority) {
      const maxPriority = await Team.findOne({}, { priority: 1 }).sort({ priority: -1 });
      assignedPriority = maxPriority ? maxPriority.priority + 1 : 1;
    } else {
      // If priority is provided, shift existing priorities if needed
      await Team.updateMany(
        { priority: { $gte: assignedPriority } },
        { $inc: { priority: 1 } }
      );
    }
    
    const teamMember = new Team({
      name: name.trim(),
      role: role.trim(),
      startYear,
      image,
      priority: assignedPriority
    });
    
    await teamMember.save();
    
    return NextResponse.json({
      success: true,
      data: teamMember
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/team error:', error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { success: false, error: 'A team member with this name already exists' },
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
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}