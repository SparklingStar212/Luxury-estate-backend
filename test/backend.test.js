import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import app from '../src/app.js'
import { store, resetStore } from '../src/data/store.js'
import { createAuthToken } from '../src/utils/auth.js'

const adminUser = store.users.find((user) => user.role === 'admin')
const adminToken = createAuthToken(adminUser)

test('health endpoint returns ok', async () => {
  const server = createServer(app)
  await new Promise((resolve) => server.listen(0, resolve))

  const { port } = server.address()
  const response = await fetch(`http://127.0.0.1:${port}/health`)
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.status, 'ok')

  await new Promise((resolve) => server.close(resolve))
})

test('seed data has policy pages', () => {
  assert.ok(store.policyPages.length >= 4)
})

test('resetStore restores mutable data', () => {
  const originalCount = store.properties.length
  store.properties.pop()
  assert.equal(store.properties.length, originalCount - 1)
  resetStore()
  assert.equal(store.properties.length, originalCount)
})

test('admin token is generated for seeded admin', () => {
  assert.ok(adminToken.includes('.'))
})

test('policy content exists for frontend pages', () => {
  const slugs = store.policyPages.map((page) => page.slug)
  assert.deepEqual(slugs.sort(), ['cookie-preferences', 'fair-housing', 'privacy-policy', 'terms-of-service'].sort())
})