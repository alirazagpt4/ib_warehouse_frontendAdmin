import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './themes/theme' // Jo file humne banayi thi
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 1. ThemeProvider: MUI ke colors aur styles apply karne ke liye */}
    <ThemeProvider theme={theme}>
      {/* 2. CssBaseline: Browser ki default CSS ko fix karne ke liye (Reset CSS) */}
      <CssBaseline />
      {/* 3. AuthProvider: Taake poori app ko Login/Logout aur Token ka pata ho */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)