import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import VentureCapital from '@/models/VentureCapital'

export async function GET() {
  try {
    await connectDB()
    const vcs = await VentureCapital.find({}).sort({ createdAt: -1 })
    return NextResponse.json(vcs)
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
    const vc = await VentureCapital.create(body)
    return NextResponse.json(vc, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

