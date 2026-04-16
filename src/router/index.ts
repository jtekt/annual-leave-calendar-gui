import { createRouter, createWebHistory } from "vue-router"
import { useCurrentUser } from "@/composables/useCurrentUser"

// Extend RouteMeta with our custom fields
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: { requiresAuth: false },
  },
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

router.beforeEach((to) => {
  const { current_user } = useCurrentUser()
  const isAuthenticated = current_user.value !== null
  const requiresAuth = to.meta.requiresAuth !== false

  // Unauthenticated user trying to access a protected route
  if (requiresAuth && !isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } }
  }

  // Already authenticated user visiting the login page
  if (to.name === "login" && isAuthenticated) {
    return { name: "new_entry" }
  }
})

export default router
