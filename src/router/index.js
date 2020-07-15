import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('../views/Attendance.vue')
  },
  {
    path: '/distribution',
    name: 'distribution',
    component: () => import('../views/Distribution.vue')
  },
  {
    path: '/examination',
    name: 'examination',
    component: () => import('../views/Examination.vue')
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('../views/Results.vue')
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/Reports.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
