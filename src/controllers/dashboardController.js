import DashboardOverview from '../models/DashboardOverview.js'
import Activity from '../models/Activity.js'
import Property from '../models/Property.js'
import Inquiry from '../models/Inquiry.js'

export const getDashboardOverview = async (_req, res, next) => {
  try {
    let overview = await DashboardOverview.findOne().lean()

    if (!overview) {
      const [totalListings, monthlyBookings, revenue, activeLeads] = await Promise.all([
        Property.countDocuments(),
        Activity.countDocuments(),
        Property.aggregate([
          { $group: { _id: null, revenue: { $sum: '$price' } } },
        ]).then((result) => result[0]?.revenue ?? 0),
        Inquiry.countDocuments({ status: 'new' }),
      ])

      overview = { totalListings, monthlyBookings, revenue, activeLeads }
    }

    return res.json(overview)
  } catch (error) {
    return next(error)
  }
}

export const getDashboardActivity = async (_req, res, next) => {
  try {
    const items = await Activity.find().sort({ createdAt: -1 }).lean()
    return res.json({ items })
  } catch (error) {
    return next(error)
  }
}
