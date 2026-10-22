import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (only the weights actually used)
import '@fontsource/cinzel/latin-400.css'
import '@fontsource/cinzel/latin-600.css'
import '@fontsource/cinzel/latin-700.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
