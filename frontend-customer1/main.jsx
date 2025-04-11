// frontend-customer1/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './src/App'
import CreateFrontend from './src/CreateFrontend'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/create" element={<CreateFrontend />} />
    </Routes>
  </BrowserRouter>
)
