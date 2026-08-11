import mongoose from 'mongoose'

const dashboardOverviewSchema = new mongoose.Schema(
  {
    totalListings: { type: Number, required: true },
    monthlyBookings: { type: Number, required: true },
    revenue: { type: Number, required: true },
    activeLeads: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('DashboardOverview', dashboardOverviewSchema)
