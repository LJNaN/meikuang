import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { STATE } from '@/ktJS/STATE'
import { API } from '@/ktJS/API'
const app = createApp(App)

app.config.globalProperties.$isOurSite = false  // 控制是否是官网数据

app.use(ElementPlus).use(router)


// 打开的煤矿的版本 ['一号', '二号', '双龙', '瑞能'] => ['yihao', 'erhao', 'shuanglong', 'ruineng']
const version = API.getVersion()

if (['yihao', 'erhao', 'shuanglong', 'ruineng'].includes(version)) {
    STATE.version = version
} else {
    STATE.version = 'yihao'
}

if (version === 'yihao') {
    if (new Date("2023-12-06") * 1 > new Date() * 1) {
        app.mount('#app')
    }

} else if (version === 'erhao') {
    if (new Date("2023-12-06") * 1 > new Date() * 1) {
        app.mount('#app')
    }

} else if (version === 'shuanglong') {
    if (new Date("2023-12-06") * 1 > new Date() * 1) {
        app.mount('#app')
    }

} else if (version === 'ruineng') {
    if (new Date("2023-12-06") * 1 > new Date() * 1) {
        app.mount('#app')
    }
}