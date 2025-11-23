import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CompanyDocument from '@/models/CompanyDocument'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const document = await CompanyDocument.findById(params.id)
    
    if (!document) {
      return NextResponse.json(
        { error: 'Company document not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(document)
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
    const document = await CompanyDocument.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!document) {
      return NextResponse.json(
        { error: 'Company document not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(document)
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
    const document = await CompanyDocument.findByIdAndDelete(params.id)
    
    if (!document) {
      return NextResponse.json(
        { error: 'Company document not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Company document deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}





