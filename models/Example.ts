import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IExample extends Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const ExampleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Example: Model<IExample> = mongoose.models.Example || mongoose.model<IExample>('Example', ExampleSchema)

export default Example

