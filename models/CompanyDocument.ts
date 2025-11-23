import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICompanyDocument extends Document {
  title: string
  documentType?: string
  description?: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  status?: string
  category?: string
  tags?: string[]
  relatedTo?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CompanyDocumentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      enum: ['contract', 'agreement', 'report', 'proposal', 'policy', 'other'],
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'draft'],
      default: 'active',
    },
    category: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    relatedTo: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const CompanyDocument: Model<ICompanyDocument> = mongoose.models.CompanyDocument || mongoose.model<ICompanyDocument>('CompanyDocument', CompanyDocumentSchema)

export default CompanyDocument





