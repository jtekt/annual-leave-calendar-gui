import { createRouter, createWebHistory } from "vue-router"
import runtimeEnv from "@/runtimeEnv"

// Extend RouteMeta with our custom fields
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

// Group pages need the group manager: without it, go to the home page
const requireGroupManager = () =>
  !!runtimeEnv.VITE_GROUP_MANAGER_API_URL || { name: "new_entry" }

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
    beforeEnter: requireGroupManager,
  },
  {
    path: "/groups/:id/entries",
    name: "group_entries",
    component: () => import("../views/GroupEntries.vue"),
    beforeEnter: requireGroupManager,
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
    name: "register_allocations",
    component: () => import("../views/Allocations.vue"),
  },
  {
    path: "/users/search",
    name: "user_search",
    component: () => import("../views/UserSearch.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
