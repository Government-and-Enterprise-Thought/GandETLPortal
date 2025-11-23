import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDealRoomDocument extends Document {
  dealRoomId: string
  title: string
  fileName?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  description?: string
  folderPath?: string // e.g., "Legal/Contracts" or "Financial/Reports"
  parentFolderId?: string // Reference to another document that is a folder
  isFolder: boolean
  documentType?: string
  status?: string
  tags?: string[]
  uploadedBy?: string
  createdAt: Date
  updatedAt: Date
}

const DealRoomDocumentSchema: Schema = new Schema(
  {
    dealRoomId: {
      type: Schema.Types.ObjectId,
      ref: 'DealRoom',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    fileType: {
      type: String,
    },
    description: {
      type: String,
    },
    folderPath: {
      type: String,
      default: '/', // Root folder
    },
    parentFolderId: {
      type: Schema.Types.ObjectId,
      ref: 'DealRoomDocument',
      default: null,
    },
    isFolder: {
      type: Boolean,
      default: false,
    },
    documentType: {
      type: String,
      enum: ['contract', 'agreement', 'report', 'proposal', 'financial', 'legal', 'other'],
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'draft'],
      default: 'active',
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
DealRoomDocumentSchema.index({ dealRoomId: 1, parentFolderId: 1 })
DealRoomDocumentSchema.index({ dealRoomId: 1, folderPath: 1 })

const DealRoomDocument: Model<IDealRoomDocument> =
  mongoose.models.DealRoomDocument ||
  mongoose.model<IDealRoomDocument>('DealRoomDocument', DealRoomDocumentSchema)

export default DealRoomDocument

