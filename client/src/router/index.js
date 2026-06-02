import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import PostsPage from '../pages/PostsPage.vue'
import LogoutPage from '../pages/LogoutPage.vue'
import CreatePostPage from '../pages/CreatePostPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import ErrorPage from '../pages/ErrorPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsPage,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePostPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)',
    name: 'Error',
    component: ErrorPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/*  AUTH GUARD */
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  }

  return true
})

export default router