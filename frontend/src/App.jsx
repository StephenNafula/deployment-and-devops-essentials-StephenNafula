import React, { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // Try to call backend health endpoint if available
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setMessage(`Backend: ${data.status}`))
      .catch(() => setMessage('Backend not available'))
  }, [])

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <h1>MERN minimal frontend</h1>
      <p>{message}</p>
      <p>This is a minimal React app scaffolded for CI/CD demos.</p>
    </div>
  )
}
