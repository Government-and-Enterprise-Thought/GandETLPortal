import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDealRoom extends Document {
  name: string
  description?: string
  status?: string
  dealType?: string
  dealValue?: number
  currency?: string
  participants?: string[]
  startDate?: Date
  endDate?: Date
  location?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const DealRoomSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'pending', 'archived'],
      default: 'active',
    },
    dealType: {
      type: String,
      enum: ['acquisition', 'merger', 'investment', 'partnership', 'statement-of-work', 'other'],
    },
    dealValue: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    participants: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    location: {
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

const DealRoom: Model<IDealRoom> = mongoose.models.DealRoom || mongoose.model<IDealRoom>('DealRoom', DealRoomSchema)

export default DealRoom


