import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { RouteNames } from '@/router/models'
import ViewHome from '@/views/ViewHome.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: RouteNames.Home,
    component: ViewHome,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
