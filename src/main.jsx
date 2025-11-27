import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'


import { SoundProvider } from './contexts/SoundContext'
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HelmetProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </HelmetProvider>
  </BrowserRouter>
)
