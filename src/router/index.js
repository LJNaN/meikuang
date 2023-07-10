import { createRouter, createWebHashHistory } from "vue-router"
const Home = () => import("@/views/Home.vue")
const Qieyan = () => import("@/views/Qieyan.vue")
const Zongcai = () => import("@/views/Zongcai.vue")
const RegionalRisk = () => import("@/views/RegionalRisk.vue")
const Other = () => import("@/views/Other.vue")
const Comprehensive = () => import("@/views/Comprehensive.vue")

const routes = [
  { path: "/", component: Home },
  { path: "/qieyan", component: Qieyan },
  { path: "/zongcai", component: Zongcai },
  { path: "/regionalrisk", component: RegionalRisk },
  { path: "/other", component: Other },
  { path: "/comprehensive", component: Comprehensive }
]



export default createRouter({
  routes,
  history: createWebHashHistory()
})