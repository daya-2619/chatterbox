import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { fullName, username, email, password } = await request.json();

    // Validate input
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, username, email, and password are required' },
        { status: 400 }
      );
    }

    if (fullName.length < 2 || fullName.length > 50) {
      return NextResponse.json(
        { error: 'Full name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Connect to database
    try {
      await connectDB();
      console.log('MongoDB connection successful');
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'This username is already taken' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    console.log('User created successfully:', { username, email });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'Account created successfully! Welcome to Chatterbox!',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check your internet connection and try again.' },
          { status: 500 }
        );
      }
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Username or email already exists. Please choose different credentials.' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
