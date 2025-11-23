import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UHNWI from '@/models/UHNWI'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const uhnwi = await UHNWI.findById(params.id)
    
    if (!uhnwi) {
      return NextResponse.json(
        { error: 'UHNWI not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(uhnwi)
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
    const uhnwi = await UHNWI.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!uhnwi) {
      return NextResponse.json(
        { error: 'UHNWI not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(uhnwi)
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
    const uhnwi = await UHNWI.findByIdAndDelete(params.id)
    
    if (!uhnwi) {
      return NextResponse.json(
        { error: 'UHNWI not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'UHNWI deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

