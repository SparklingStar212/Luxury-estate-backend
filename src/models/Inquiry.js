import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: 'General Inquiry', trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, default: 'new', trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Inquiry', inquirySchema)
