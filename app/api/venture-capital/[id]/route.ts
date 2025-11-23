import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import VentureCapital from '@/models/VentureCapital'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const vc = await VentureCapital.findById(params.id)
    
    if (!vc) {
      return NextResponse.json(
        { error: 'Venture Capital company not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(vc)
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
    const vc = await VentureCapital.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!vc) {
      return NextResponse.json(
        { error: 'Venture Capital company not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(vc)
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
    const vc = await VentureCapital.findByIdAndDelete(params.id)
    
    if (!vc) {
      return NextResponse.json(
        { error: 'Venture Capital company not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Venture Capital company deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

