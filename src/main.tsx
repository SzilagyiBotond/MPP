import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './customBootstrap.scss'
import App from "./component/App.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
