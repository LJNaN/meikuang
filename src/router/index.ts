import { createRouter, createWebHashHistory } from "vue-router"
const Home = () => import("@/views/Home.vue")
const Qieyan = () => import("@/views/Qieyan.vue")
const Zongcai = () => import("@/views/Zongcai.vue")
const Quyufengxian = () => import("@/views/Quyufengxian.vue")

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