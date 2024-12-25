import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MoneytaryApp from "./MoneytaryApp.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoneytaryApp />
  </StrictMode>,
)
