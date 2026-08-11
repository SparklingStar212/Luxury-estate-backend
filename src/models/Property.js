import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    neighborhood: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    area: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    image: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Property', propertySchema)
