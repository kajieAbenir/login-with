import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Signup from './pages/Signup.vue'
import LoginOptions from './pages/LoginOptions.vue'
import ForgotPassword from './pages/ForgotPassword.vue'
import Dashboard from './pages/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login-options',
    name: 'LoginOptions',
    component: LoginOptions
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
