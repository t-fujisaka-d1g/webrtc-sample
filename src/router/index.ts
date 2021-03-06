import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import { RouteLocations, RouteNames } from '@/router/models'
import ViewHome from '@/views/ViewHome.vue'
import { LocalStorage } from '@/localStorage'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: RouteNames.Login,
    component: () => import(/* webpackChunkName: "login" */ '../views/ViewLogin.vue'),
  },
  {
    path: '/:apiKey',
    name: RouteNames.Home,
    component: ViewHome,
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample1',
    name: RouteNames.Sample1,
    component: () => import(/* webpackChunkName: "sample1" */ '../views/ViewSample1.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample2',
    name: RouteNames.Sample2a,
    component: () => import(/* webpackChunkName: "sample2" */ '../views/ViewSample2a.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
    }),
  },
  {
    path: '/:apiKey/sample2/:peerId',
    name: RouteNames.Sample2b,
    component: () => import(/* webpackChunkName: "sample2" */ '../views/ViewSample2b.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
      peerId: route.params.peerId,
    }),
  },
  {
    path: '/:apiKey/sample3/:roomName?',
    name: RouteNames.Sample3,
    component: () => import(/* webpackChunkName: "sample3" */ '../views/ViewSample3.vue'),
    props: (route: Route) => ({
      apiKey: route.params.apiKey,
      roomName: route.params.roomName ?? null,
    }),
  },
  {
    path: '*',
    redirect: () => {
      const apiKey = LocalStorage.apiKey
      return apiKey === null ? RouteLocations.toLogin() : RouteLocations.toHome(apiKey)
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
