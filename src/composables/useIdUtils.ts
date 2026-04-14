import { computed } from "vue"
import { useCurrentUser } from "@/composables/useCurrentUser"
import type { User } from "@/types"

type IdentifiableItem = Pick<User, "_id" | "properties" | "identity">

export function useIdUtils() {
  const { current_user } = useCurrentUser()

  function get_id_of_item(item: IdentifiableItem): string {
    let id: string | undefined = item._id ?? item.properties?._id

    if (!id) {
      console.warn("Item does not have an _id:", item)
      const identity = item.identity
      if (typeof identity === "object" && identity !== null && "low" in identity) {
        id = String(identity.low)
      } else {
        id = String(identity)
      }
    }

    return id as string
  }

  const current_user_id = computed<string | undefined>(() => {
    if (!current_user.value) return undefined
    return get_id_of_item(current_user.value)
  })

  return { get_id_of_item, current_user_id }
}
