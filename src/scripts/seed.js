import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import Property from '../models/Property.js'
import Agent from '../models/Agent.js'
import Inquiry from '../models/Inquiry.js'
import Activity from '../models/Activity.js'
import DashboardOverview from '../models/DashboardOverview.js'
import { properties, agents, inquiries, dashboardActivity, dashboardOverview } from '../data/seedData.js'

dotenv.config()

const seed = async () => {
  await connectDB()

  await Promise.all([
    Property.deleteMany({}),
    Agent.deleteMany({}),
    Inquiry.deleteMany({}),
    Activity.deleteMany({}),
    DashboardOverview.deleteMany({}),
  ])

  await Property.insertMany(properties)
  await Agent.insertMany(agents)
  await Inquiry.insertMany(inquiries)
  await Activity.insertMany(dashboardActivity)
  await DashboardOverview.create(dashboardOverview)

  console.log('MongoDB seed completed')
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
