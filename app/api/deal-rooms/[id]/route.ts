import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DealRoom from '@/models/DealRoom'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const dealRoom = await DealRoom.findById(params.id)
    
    if (!dealRoom) {
      return NextResponse.json(
        { error: 'Deal room not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(dealRoom)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    const dealRoom = await DealRoom.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!dealRoom) {
      return NextResponse.json(
        { error: 'Deal room not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(dealRoom)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const dealRoom = await DealRoom.findByIdAndDelete(params.id)
    
    if (!dealRoom) {
      return NextResponse.json(
        { error: 'Deal room not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Deal room deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}





