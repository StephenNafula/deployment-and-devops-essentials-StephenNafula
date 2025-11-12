// Production-ready Express backend (minimal)
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const { connectToDatabase } = require('./db')

const app = express()
const port = process.env.PORT || 5000

// Security headers
app.use(helmet())

// Logging - concise format in dev, combined in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// CORS — allow requests from frontend domain (or wildcard for development)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())

// Health route that also reports db state when connected
app.get('/api/health', (req, res) => {
  const dbState = (process.env.MONGO_URI && require('mongoose').connection.readyState) || null
  res.json({ status: 'ok', time: new Date().toISOString(), dbState })
})

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' })
})

// 404 handler for API
app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'Not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

async function start() {
  try {
    // Connect to DB if MONGO_URI available
    if (process.env.MONGO_URI) {
      await connectToDatabase(process.env.MONGO_URI)
    }

    const server = app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received: closing server')
      server.close(() => process.exit(0))
    })
    process.on('SIGINT', () => {
      console.log('SIGINT received: closing server')
      server.close(() => process.exit(0))
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
