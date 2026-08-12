import dotenv from 'dotenv'
import { connectDB } from './config/database.js' // Your DB connection file
import { seedData } from './seed.js'
import {
  CollectionModel,
  InquiryModel,
  ConciergeServiceModel,
  PropertyModel
} from './models/schemas.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    await connectDB()

    console.log('Clearing existing collections in MongoDB...')
    await CollectionModel.deleteMany({})
    await InquiryModel.deleteMany({})
    await ConciergeServiceModel.deleteMany({})
    await PropertyModel.deleteMany({})

    console.log('Inserting seed data into MongoDB...')
    await CollectionModel.insertMany(seedData.collections)
    await InquiryModel.insertMany(seedData.inquiries)
    await ConciergeServiceModel.insertMany(seedData.conciergeServices)
    await PropertyModel.insertMany(seedData.properties)

    console.log('Database successfully seeded!')
    process.exit(0)
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`)
    process.exit(1)
  }
}

seedDatabase()