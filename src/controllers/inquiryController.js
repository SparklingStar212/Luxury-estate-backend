import { store } from '../data/store.js'

const formatInquiry = (inquiry) => ({
  id: inquiry.id,
  fullName: inquiry.fullName,
  email: inquiry.email,
  phone: inquiry.phone,
  subject: inquiry.subject,
  message: inquiry.message,
  propertyId: inquiry.propertyId,
  agentId: inquiry.agentId,
  status: inquiry.status,
  priority: inquiry.priority,
  createdAt: inquiry.createdAt,
  updatedAt: inquiry.updatedAt,
})

const formatMessage = (message) => ({
  id: message.id,
  inquiryId: message.inquiryId,
  senderType: message.senderType,
  body: message.body,
  attachmentUrl: message.attachmentUrl || null,
  createdAt: message.createdAt,
})

const buildThread = (inquiryId) => {
  return store.inquiryMessages
    .filter((message) => message.inquiryId === inquiryId)
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt))
    .map(formatMessage)
}

export const listInquiries = (req, res) => {
  const status = String(req.query.status || '').toLowerCase()
  const search = String(req.query.search || req.query.q || '').toLowerCase()

  let items = [...store.inquiries]

  if (status) {
    items = items.filter((inquiry) => inquiry.status.toLowerCase() === status)
  }

  if (search) {
    items = items.filter((inquiry) => [inquiry.fullName, inquiry.email, inquiry.subject, inquiry.message].filter(Boolean).join(' ').toLowerCase().includes(search))
  }

  const enriched = items
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((inquiry) => ({
      ...formatInquiry(inquiry),
      property: store.properties.find((property) => property.id === inquiry.propertyId) || null,
      agent: store.agents.find((agent) => agent.id === inquiry.agentId) || null,
      thread: buildThread(inquiry.id),
    }))

  res.json({ items: enriched, total: enriched.length })
}

export const getInquiryById = (req, res) => {
  const inquiryId = Number(req.params.id)
  const inquiry = store.inquiries.find((item) => item.id === inquiryId)

  if (!inquiry) {
    return res.status(404).json({ message: 'Inquiry not found' })
  }

  return res.json({
    inquiry: {
      ...formatInquiry(inquiry),
      property: store.properties.find((property) => property.id === inquiry.propertyId) || null,
      agent: store.agents.find((agent) => agent.id === inquiry.agentId) || null,
      thread: buildThread(inquiry.id),
    },
  })
}

export const createInquiry = (req, res) => {
  const { fullName, email, phone = '', subject = '', message, propertyId = null, agentId = null, priority = 'normal' } = req.body

  if (!fullName || !email || !message) {
    return res.status(400).json({ message: 'fullName, email, and message are required' })
  }

  const nextId = Math.max(0, ...store.inquiries.map((item) => item.id)) + 1
  const now = new Date().toISOString()

  const inquiry = {
    id: nextId,
    fullName,
    email,
    phone,
    subject,
    message,
    propertyId: propertyId === null || propertyId === '' ? null : Number(propertyId),
    agentId: agentId === null || agentId === '' ? null : Number(agentId),
    status: 'new',
    priority,
    createdAt: now,
    updatedAt: now,
  }

  store.inquiries.push(inquiry)
  store.inquiryMessages.push({
    id: Math.max(0, ...store.inquiryMessages.map((item) => item.id)) + 1,
    inquiryId: inquiry.id,
    senderType: 'client',
    body: message,
    attachmentUrl: null,
    createdAt: now,
  })

  return res.status(201).json({ inquiry: formatInquiry(inquiry) })
}

export const addInquiryMessage = (req, res) => {
  const inquiryId = Number(req.params.id)
  const inquiry = store.inquiries.find((item) => item.id === inquiryId)

  if (!inquiry) {
    return res.status(404).json({ message: 'Inquiry not found' })
  }

  const { body, senderType = 'agent', attachmentUrl = null } = req.body

  if (!body) {
    return res.status(400).json({ message: 'body is required' })
  }

  const message = {
    id: Math.max(0, ...store.inquiryMessages.map((item) => item.id)) + 1,
    inquiryId,
    senderType,
    body,
    attachmentUrl,
    createdAt: new Date().toISOString(),
  }

  store.inquiryMessages.push(message)
  inquiry.updatedAt = message.createdAt

  return res.status(201).json({ message: formatMessage(message) })
}

export const updateInquiryStatus = (req, res) => {
  const inquiryId = Number(req.params.id)
  const inquiry = store.inquiries.find((item) => item.id === inquiryId)

  if (!inquiry) {
    return res.status(404).json({ message: 'Inquiry not found' })
  }

  const { status, priority, agentId } = req.body

  if (status) inquiry.status = status
  if (priority) inquiry.priority = priority
  if (agentId !== undefined) inquiry.agentId = agentId === null || agentId === '' ? null : Number(agentId)
  inquiry.updatedAt = new Date().toISOString()

  return res.json({ inquiry: formatInquiry(inquiry) })
}

export const assignInquiry = (req, res) => {
  const inquiryId = Number(req.params.id)
  const inquiry = store.inquiries.find((item) => item.id === inquiryId)

  if (!inquiry) {
    return res.status(404).json({ message: 'Inquiry not found' })
  }

  const { agentId } = req.body

  if (agentId === undefined || agentId === null || agentId === '') {
    return res.status(400).json({ message: 'agentId is required' })
  }

  inquiry.agentId = Number(agentId)
  inquiry.updatedAt = new Date().toISOString()

  return res.json({ inquiry: formatInquiry(inquiry) })
}

export const getInquiryStats = (_req, res) => {
  const total = store.inquiries.length
  const urgent = store.inquiries.filter((inquiry) => inquiry.priority === 'high').length
  const inProgress = store.inquiries.filter((inquiry) => inquiry.status === 'in_progress').length
  const newCount = store.inquiries.filter((inquiry) => inquiry.status === 'new').length

  res.json({ total, urgent, inProgress, newCount })
}

export const getRecentLeads = (_req, res) => {
  const items = store.inquiries
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 10)
    .map(formatInquiry)

  res.json({ items })
}