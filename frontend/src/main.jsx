import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

// Code-splitting: lazy-load the App component to create a separate chunk
const App = lazy(() => import('./App'))

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading app...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
)
