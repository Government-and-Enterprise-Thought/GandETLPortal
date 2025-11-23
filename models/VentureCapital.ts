import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IVentureCapital extends Document {
  companyName: string
  website?: string
  email?: string
  fundSize?: number
  status?: string
  description?: string
  industryFocus?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const VentureCapitalSchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
    },
    fundSize: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    description: {
      type: String,
    },
    industryFocus: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const VentureCapital: Model<IVentureCapital> = mongoose.models.VentureCapital || mongoose.model<IVentureCapital>('VentureCapital', VentureCapitalSchema)

export default VentureCapital

