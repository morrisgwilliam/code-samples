import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from "react-redux"
import './index.css'
import App from './App.tsx'
import store from "./state/store"

createRoot(document.getElementById('root')!).render(
    <ReduxProvider store={ store }>
      <App />
    </ReduxProvider>
)
