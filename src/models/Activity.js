import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    client: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    property: { type: String, required: true, trim: true },
    inquiryType: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Activity', activitySchema)
