import { ref } from "vue"
import type { User } from "@/types"

// Module-level state — shared across all composable calls (singleton)
const current_user = ref<User | null>(null)

export function useCurrentUser() {
  function setCurrentUser(user: User | null) {
    current_user.value = user
  }

  return { current_user, setCurrentUser }
}
