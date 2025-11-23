import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUHNWI extends Document {
  name: string
  email?: string
  netWorth?: number
  status?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const UHNWISchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    netWorth: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const UHNWI: Model<IUHNWI> = mongoose.models.UHNWI || mongoose.model<IUHNWI>('UHNWI', UHNWISchema)

export default UHNWI

