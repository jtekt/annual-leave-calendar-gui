import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

export function useYear() {
  const route = useRoute()
  const router = useRouter()

  const year = computed({
    get: () => Number(route.query.year) || new Date().getFullYear(),
    set: (val) => router.replace({ query: { ...route.query, year: val } }),
  })

  const yearItems = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i - 5
  )

  return { year, yearItems }
}
