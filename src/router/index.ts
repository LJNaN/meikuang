import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Qieyan from "@/views/Qieyan.vue"
import Zongcai from "@/views/Zongcai.vue"
import Quyufengxian from "@/views/Quyufengxian.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/qieyan", component: Qieyan },
  { path: "/zongcai", component: Zongcai },
  { path: "/quyufengxian", component: Quyufengxian },
]



export default createRouter({
  routes,
  history: createWebHashHistory()
})