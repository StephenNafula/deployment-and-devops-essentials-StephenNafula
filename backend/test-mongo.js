/*
  Simple MongoDB connection test script.
  Usage:
    - set MONGO_URI in environment or create a backend/.env file with MONGO_URI
    - run: node backend/test-mongo.js
*/
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Please set MONGO_URI in your environment or backend/.env file');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Ping succeeded — connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
