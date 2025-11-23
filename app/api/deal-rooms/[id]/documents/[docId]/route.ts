import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DealRoomDocument from '@/models/DealRoomDocument'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; docId: string } }
) {
  try {
    await connectDB()
    const document = await DealRoomDocument.findOne({
      _id: params.docId,
      dealRoomId: params.id,
    })
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
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
  { params }: { params: { id: string; docId: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    
    const document = await DealRoomDocument.findOneAndUpdate(
      { _id: params.docId, dealRoomId: params.id },
      body,
      { new: true, runValidators: true }
    )
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
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
  { params }: { params: { id: string; docId: string } }
) {
  try {
    await connectDB()
    
    // Check if document is a folder and has children
    const document = await DealRoomDocument.findById(params.docId)
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    if (document.isFolder) {
      const children = await DealRoomDocument.find({ parentFolderId: params.docId })
      if (children.length > 0) {
        return NextResponse.json(
          { error: 'Cannot delete folder with contents. Please delete or move contents first.' },
          { status: 400 }
        )
      }
    }
    
    await DealRoomDocument.findOneAndDelete({
      _id: params.docId,
      dealRoomId: params.id,
    })
    
    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

