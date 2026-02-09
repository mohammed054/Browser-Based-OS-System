import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'   // OS styles
// Remove conflicting index.css import

// Debug: Check if root element exists
const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)
console.log('CSS loaded:', document.styleSheets.length > 0)

// Mount React App
const root = createRoot(rootElement)

// Add error boundary to catch rendering errors
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Debug: Log any errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})
