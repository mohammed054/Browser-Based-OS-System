import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'   // ⚡ Import your CSS here

// Mount the React App
const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
