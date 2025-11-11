// Minimal Express backend for MERN scaffold
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// simple health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// simple example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
