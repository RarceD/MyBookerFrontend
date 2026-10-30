import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import theme from './theme'
import './index.css'

if ('serviceWorker' in navigator) {
    if (import.meta.env.PROD) {
        window.addEventListener('load', () => {
            void navigator.serviceWorker.register('/serviceWorker.js').catch(() => undefined)
        })
    } else {
        void navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => void registration.unregister())
        })
    }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
)
