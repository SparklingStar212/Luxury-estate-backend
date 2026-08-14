import mongoose from 'mongoose'

// --- 1. USER MODEL ---
const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin', 'super_admin'],
      default: 'user',
    },
    avatarUrl: String,
    phone: String,
  },
  { timestamps: true }
)

// --- 2. AGENT MODEL ---
const agentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, default: null },
    name: { type: String, required: true },
    title: String,
    bio: String,
    photoUrl: String,
    email: String,
    phone: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// --- 3. PROPERTY MODEL ---
const propertySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: String,
    state: String,
    country: String,
    beds: Number,
    baths: Number,
    areaSqft: Number,
    propertyType: String,
    status: {
      type: String,
      enum: ['active', 'pending', 'sold', 'archived'],
      default: 'active',
    },
    featured: { type: Boolean, default: false },
    latitude: Number,
    longitude: Number,
    heroImageUrl: String,
    galleryImages: [String],
    floorPlans: Array,
    amenities: [String],
    overview: String,
    agentId: Number,
  },
  { timestamps: true }
)

// --- 4. COLLECTION MODEL ---
const collectionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    coverImageUrl: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    propertyIds: [Number],
    articleIds: [Number],
  },
  { timestamps: true }
)

// --- 5. COLLECTION ARTICLE MODEL ---
const collectionArticleSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    collectionId: Number,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    category: String,
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// --- 6. CONCIERGE SERVICE MODEL ---
const conciergeServiceSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    icon: String,
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// --- 7. MEMBERSHIP PLAN MODEL ---
const membershipPlanSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    billingCycle: String,
    description: String,
    monthlyPrice: Number,
    annualPrice: Number,
    priceLabel: String,
    subLabel: String,
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    features: [String],
  },
  { timestamps: true }
)

// --- 8. INQUIRY MODEL ---
const inquirySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: String,
    message: { type: String, required: true },
    propertyId: Number,
    agentId: Number,
    status: {
      type: String,
      enum: ['new', 'open', 'pending', 'in_progress', 'urgent', 'closed'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
  },
  { timestamps: true }
)

// --- 9. INQUIRY MESSAGE MODEL ---
const inquiryMessageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    inquiryId: Number,
    senderType: String,
    body: String,
  },
  { timestamps: true }
)

// --- 10. HOUSE RECORDING MODEL ---
const houseRecordingSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: String,
    duration: String,
    quality: String,
    status: String,
    imageUrl: String,
  },
  { timestamps: true }
)

// --- 11. DASHBOARD METRIC MODEL ---
const dashboardMetricSchema = new mongoose.Schema(
  {
    metricKey: { type: String, required: true, unique: true },
    metricValue: { type: String, required: true },
    metricDelta: String,
    period: String,
  },
  { timestamps: true }
)

// --- 12. DASHBOARD ACTIVITY MODEL ---
const dashboardActivitySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    user: String,
    action: String,
    item: String,
    time: String,
    critical: Boolean,
  },
  { timestamps: true }
)

// --- 13. NETWORK LOAD MODEL ---
const networkLoadSchema = new mongoose.Schema(
  {
    region: String,
    load: Number,
    latencyMs: Number,
  },
  { timestamps: true }
)

// --- 14. ADMIN ACTIVITY MODEL ---
const adminActivitySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    actorName: { type: String, required: true },
    action: { type: String, required: true },
    entityType: String,
    entityId: Number,
  },
  { timestamps: true }
)

// --- 15. POLICY PAGE MODEL ---
const policyPageSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
)

// --- EXPORT ALL MODELS ---
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema)
export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema)
export const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema)
export const CollectionArticle = mongoose.models.CollectionArticle || mongoose.model('CollectionArticle', collectionArticleSchema)
export const ConciergeService = mongoose.models.ConciergeService || mongoose.model('ConciergeService', conciergeServiceSchema)
export const MembershipPlan = mongoose.models.MembershipPlan || mongoose.model('MembershipPlan', membershipPlanSchema)
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)
export const InquiryMessage = mongoose.models.InquiryMessage || mongoose.model('InquiryMessage', inquiryMessageSchema)
export const HouseRecording = mongoose.models.HouseRecording || mongoose.model('HouseRecording', houseRecordingSchema)
export const DashboardMetric = mongoose.models.DashboardMetric || mongoose.model('DashboardMetric', dashboardMetricSchema)
export const DashboardActivity = mongoose.models.DashboardActivity || mongoose.model('DashboardActivity', dashboardActivitySchema)
export const NetworkLoad = mongoose.models.NetworkLoad || mongoose.model('NetworkLoad', networkLoadSchema)
export const AdminActivity = mongoose.models.AdminActivity || mongoose.model('AdminActivity', adminActivitySchema)
export const PolicyPage = mongoose.models.PolicyPage || mongoose.model('PolicyPage', policyPageSchema)