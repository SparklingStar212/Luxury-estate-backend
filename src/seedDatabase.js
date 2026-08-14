import dotenv from 'dotenv'
import { connectDB } from './config/database.js' // Your DB connection file
import { seedData } from './data/seed.js' // Your seed data file
import {
  Collection,
  Inquiry,
  ConciergeService,
  Property
} from './data/schema.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    await connectDB()

    console.log('Clearing existing collections in MongoDB...')
    await Collection.deleteMany({})
    await Inquiry.deleteMany({})
    await ConciergeService.deleteMany({})
    await Property.deleteMany({})

    console.log('Inserting seed data into MongoDB...')
    await Collection.insertMany(seedData.collections)
    await Inquiry.insertMany(seedData.inquiries)
    await ConciergeService.insertMany(seedData.conciergeServices)
    await Property.insertMany(seedData.properties)

    console.log('Database successfully seeded!')
    process.exit(0)
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`)
    process.exit(1)
  }
}

seedDatabase()