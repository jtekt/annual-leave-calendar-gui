import { ref } from "vue"

export type CalendarDisplayMode = "grid" | "dates"

const mode = ref<CalendarDisplayMode>("grid")

export function useCalendarDisplayMode() {
  return { mode }
}
