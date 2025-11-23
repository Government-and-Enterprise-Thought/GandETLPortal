import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import UHNWI from '@/models/UHNWI'

export async function GET() {
  try {
    await connectDB()
    const uhnwis = await UHNWI.find({}).sort({ createdAt: -1 })
    return NextResponse.json(uhnwis)
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
    const uhnwi = await UHNWI.create(body)
    return NextResponse.json(uhnwi, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

