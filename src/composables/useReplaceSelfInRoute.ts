import type { RouteLocationNormalizedLoaded, Router } from "vue-router"
import { useIdUtils } from "@/composables/useIdUtils"

// Swaps a "self" id param for the current user's real id so the resulting
// URL stays valid when shared with someone else. These routes require auth,
// so current_user_id is already known by the time this runs.
export function useReplaceSelfInRoute(
  route: RouteLocationNormalizedLoaded,
  router: Router
) {
  const { current_user_id } = useIdUtils()

  if (route.params.id === "self" && current_user_id.value) {
    router.replace({
      name: route.name ?? undefined,
      params: { ...route.params, id: current_user_id.value },
      query: route.query,
      hash: route.hash,
    })
  }
}
