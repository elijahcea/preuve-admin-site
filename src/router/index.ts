import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/routes/Home.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home },
    { path: "/products", component: Home },
    { path: "/collections", component: Home },
    { path: "/options", component: Home }
  ],
})

export default router
