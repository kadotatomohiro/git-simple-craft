import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

// PWA Service Worker 登録（ゼロ依存・手書き実装）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ViteのベースURLを考慮したパスの指定
    const swUrl = import.meta.env.BASE_URL + 'sw.js'
    navigator.serviceWorker.register(swUrl).catch(error => {
      console.log('SW Registration Failed: ', error)
    });
  });
}
