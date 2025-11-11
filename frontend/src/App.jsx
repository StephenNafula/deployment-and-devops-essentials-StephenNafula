import React, { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // Try to call backend health endpoint if available.
    // Use Vite env var VITE_API_BASE_URL if present, otherwise default to `/api`.
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

    let cancelled = false

    async function checkHealth() {
      try {
        const res = await fetch(`${apiBase}/health`)
        if (cancelled) return
        if (!res.ok) {
          setMessage(`Backend error: ${res.status} ${res.statusText}`)
          return
        }
        const data = await res.json()
        setMessage(`Backend: ${data.status} (time: ${data.time})`)
      } catch (err) {
        if (cancelled) return
        // show the error message to aid debugging in dev
        setMessage(`Backend not available — ${err.message}`)
      }
    }

    checkHealth()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <h1>MERN minimal frontend</h1>
      <p>{message}</p>
      <hr />
      <h3>Debug info</h3>
      <p>Page URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
      <p>API base (VITE_API_BASE_URL): {import.meta.env.VITE_API_BASE_URL || '/api'}</p>
      <p>This is a minimal React app scaffolded for CI/CD demos.</p>
    </div>
  )
}
