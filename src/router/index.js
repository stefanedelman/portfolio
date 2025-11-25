import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Lawcrative from '../views/Lawcrative.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/project/lawcrative',
    name: 'Lawcrative',
    component: Lawcrative
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
