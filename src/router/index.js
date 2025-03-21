import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/groups",
    name: "groups",
    component: () => import("../views/Groups.vue"),
  },
  {
    path: "/groups/:id/entries",
    name: "group_entries",
    component: () => import("../views/GroupEntries.vue"),
  },
  {
    path: "/entries/new",
    alias: "/",
    name: "new_entry",
    component: () => import("../views/NewEntry.vue"),
  },
  {
    path: "/entries/:id",
    name: "entry",
    component: () => import("../views/Entry.vue"),
  },
  {
    path: "/users/:id/entries",
    name: "user_entries",
    component: () => import("../views/UserEntries.vue"),
  },
  {
    path: "/users/:id/allocations",
    name: "user_allocations",
    component: () => import("../views/Allocations.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
