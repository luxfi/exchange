// Setup for integration tests
import fetch from 'node-fetch'

global.fetch = fetch
global.WebSocket = require('ws')
global.performance = {
  now: () => Date.now(),
}

// Mock environment variables
process.env.NEXT_PUBLIC_WS_URL = 'ws://localhost:8081'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080'

// Increase timeout for integration tests
jest.setTimeout(60000)