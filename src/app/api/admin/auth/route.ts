import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Admin password not configured' },
        { status: 500 }
      );
    }
    
    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create a simple session token (in production, use JWT)
    const sessionToken = Buffer.from(`admin:${Date.now()}`).toString('base64');
    
    // Set cookie for authentication
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful'
    });
    
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }
    
    // Simple validation (in production, use proper JWT validation)
    const isValid = sessionToken.startsWith(Buffer.from('admin:').toString('base64').substring(0, 8));
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      authenticated: true
    });
    
  } catch (error) {
    console.error('Admin session check error:', error);
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
  
  response.cookies.delete('admin_session');
  
  return response;
}