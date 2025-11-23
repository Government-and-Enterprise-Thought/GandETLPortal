import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({ 
      success: true, 
      message: 'Connected to MongoDB successfully',
      database: 'gandetl',
      host: '192.168.1.84'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

