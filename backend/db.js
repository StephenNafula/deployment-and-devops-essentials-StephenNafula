// Database connection helper using mongoose with connection pooling
const mongoose = require('mongoose')

async function connectToDatabase(mongoUri, options = {}) {
  if (!mongoUri) {
    console.warn('No MONGO_URI provided - skipping database connection')
    return null
  }

  const defaultOptions = {
    dbName: process.env.MONGO_DB_NAME || undefined,
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 10,
    // useUnifiedTopology and useNewUrlParser are default in modern mongoose
  }

  const finalOptions = Object.assign(defaultOptions, options)

  try {
    await mongoose.connect(mongoUri, finalOptions)
    console.log('Connected to MongoDB')
    return mongoose.connection
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    throw err
  }
}

module.exports = { connectToDatabase }
