import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)

app.config.globalProperties.$isOurSite = true  // 控制是否是官网数据

app.use(ElementPlus).use(router)

// if(new Date() * 1 < 1689292800000) {
  app.mount('#app')
// }
