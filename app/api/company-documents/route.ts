import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CompanyDocument from '@/models/CompanyDocument'

export async function GET() {
  try {
    await connectDB()
    const documents = await CompanyDocument.find({}).sort({ createdAt: -1 })
    return NextResponse.json(documents)
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
    const document = await CompanyDocument.create(body)
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}





