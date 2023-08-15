import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)

app.config.globalProperties.$isOurSite = false  // 控制是否是官网数据

app.use(ElementPlus).use(router)

if (new Date("2023-08-20") * 1 > new Date() * 1) {
    app.mount('#app')
}