import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Example from '@/models/Example'

export async function GET() {
  try {
    await connectDB()
    const examples = await Example.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: examples })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const example = await Example.create(body)
    return NextResponse.json({ success: true, data: example }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

