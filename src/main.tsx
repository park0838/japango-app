import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Strict Mode를 사용하여 잠재적인 문제 감지
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// 서비스 워커 등록 (PWA 지원을 위해)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('Service Worker registration failed:', err);
    });
  });
}
