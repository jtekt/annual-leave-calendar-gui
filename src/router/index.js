import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import('../views/Groups.vue')
  },
  {
    path: '/groups/:id/entries',
    name: 'group_entries',
    component: () => import('../views/GroupEntries.vue')
  },
  {
    path: '/entries/new',
    name: 'new_entry',
    component: () => import('../views/NewEntry.vue')
  },
  {
    path: '/entries/:id',
    name: 'entry',
    component: () => import('../views/Entry.vue')
  },
  {
    path: '/users/:id/entries',
    name: 'user_entries',
    component: () => import('../views/UserEntries.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
