import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DealRoomDocument from '@/models/DealRoomDocument'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const parentFolderId = searchParams.get('parentFolderId')
    
    const query: any = { dealRoomId: params.id }
    if (parentFolderId === 'root' || !parentFolderId) {
      query.parentFolderId = null
    } else {
      query.parentFolderId = parentFolderId
    }
    
    const documents = await DealRoomDocument.find(query).sort({ isFolder: -1, title: 1 })
    return NextResponse.json(documents)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    
    const document = await DealRoomDocument.create({
      ...body,
      dealRoomId: params.id,
    })
    
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

