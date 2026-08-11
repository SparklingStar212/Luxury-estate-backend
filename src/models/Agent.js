import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Agent', agentSchema)
