import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DealRoom from '@/models/DealRoom'

export async function GET() {
  try {
    await connectDB()
    const dealRooms = await DealRoom.find({}).sort({ createdAt: -1 })
    return NextResponse.json(dealRooms)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const dealRoom = await DealRoom.create(body)
    return NextResponse.json(dealRoom, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}





