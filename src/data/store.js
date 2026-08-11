import { seedData } from './seed.js'

export const store = structuredClone(seedData)

export const resetStore = () => {
  const freshStore = structuredClone(seedData)
  Object.keys(store).forEach((key) => {
    store[key] = freshStore[key]
  })
}