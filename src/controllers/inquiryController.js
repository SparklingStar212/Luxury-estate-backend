import Inquiry from '../models/Inquiry.js'

export const listInquiries = async (_req, res, next) => {
  try {
    const items = await Inquiry.find().sort({ createdAt: -1 }).lean()
    return res.json({ items })
  } catch (error) {
    return next(error)
  }
}

export const createInquiry = async (req, res, next) => {
  const { name, email, message, subject = 'General Inquiry' } = req.body ?? {}

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email, and message are required' })
  }

  try {
    const inquiry = await Inquiry.create({ name, email, subject, message })

    return res.status(201).json({ message: 'Inquiry created', inquiry })
  } catch (error) {
    return next(error)
  }
}
